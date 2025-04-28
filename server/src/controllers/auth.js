const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const {hashPassword} = require("../utils/password");
const {
    generateVerifyEmailToken,
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    verifyRefreshToken,
    decodeRefreshToken
} = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            })
        }

        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            })
        }

        const user = new User({
            name,
            email,
            password,
        });

        user.password = await hashPassword(password);
        user.verificationToken = generateVerifyEmailToken();
        user.verificationTokenExpire = Date.now() + 3600000;

        const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email/${user.verificationToken}`;

        await sendEmail({
            to: user.email,
            subject: "Email Verification",
            text: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your account:</p>
          <a href="${verificationUrl}" target="_blank">Verify Email</a>
          <p>Or enter this token manually:</p>
          <h2>${user.verificationToken}</h2>
          <p>This link will expire in 1 hour.</p>
        `,
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Register successful. Please check your email to verify your account",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during register",
        })
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email and password",
            })
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found",
            })
        }

        // Check for failed login attempts
        if (user.failedLoginAttempts >= 5 && user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Account temporarily locked, please try again later",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
            }

            await user.save();
            return res.status(400).json({
                success: false,
                message: "Invalid Password",
            })
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified. Please verify your email before logging in.",
            })

        }

        // Reset failed login attempts on successful login
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;

        // Generate tokens
        const accessToken = generateAccessToken(res, user._id);
        const refreshToken = generateRefreshToken(res,user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
        });
    } catch (error) {
        console.error(`Login error: ${error.message}`);
        // return next(new ErrorResponse(500, "An error occurred during login"));
        return res.status(500).json({ // 500 Internal Server Error.
            success: false,
            message: "An error occurred during login",
        })
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token provided",
            })
        }

        const decoded = decodeRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId);
        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }

        // Clear cookies
        // res.cookie("refreshToken", "", {maxAge: 0, ...refreshTokenCookieOptions});
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during logout",
        })
    }
};

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        const {verificationToken} = req.body;

        if (!verificationToken) {
            // return next(new ErrorResponse(400, "Please provide a verify token"));
            // 400 Bad Request.
            return res.status(400).json({
                success: false,
                message: "Please provide a verify token",
            })
        }

        const user = await User.findOne({
            verificationToken,
            verificationTokenExpire: {$gt: Date.now()},
        });

        if (!user) {
            // return next(new ErrorResponse(400, "Invalid or expired token"));
            // 401 Unauthorized.
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        // return next(new ErrorResponse(500, "Error when verify email"));
        return res.status(500).json({
            success: false,
            message: "Error when verify email",
        })
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification-token
// @access  Public
exports.resendVerificationToken = async (req, res, next) => {
    try {
        const {email} = req.params;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email",
            })
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found",
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            })
        }

        // Generate verification token
        const verificationToken = generateVerifyEmailToken();
        user.verificationToken = verificationToken;
        user.verificationTokenExpire = Date.now() + 3600000;

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;

        await user.save();

        // Send verification email
        await sendEmail({
            to: user.email,
            subject: "Email Verification",
            text: `
                  <h1>Email Verification</h1>
                  <p>Please click the link below to verify your account:</p>
                  <a href="${verificationUrl}" target="_blank">Verify Email</a>
                  <p>Or enter this token manually:</p>
                  <h2>${verificationToken}</h2>
                `,
        });

        res.status(200).json({
            success: true,
            message: "Verification email sent",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while resending verification token",
        })
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token provided",
            })
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired refresh token",
            })
        }

        // Find user and verify refresh token
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired refresh token",
            })
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id); // Rotate refresh token
        user.refreshToken = newRefreshToken;

        await user.save();

        res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while refreshing token",
        })
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorResponse(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found",
            })
        }

        // Get reset token
        const resetPasswordToken = generateResetPasswordToken();
        const resetPasswordExpire = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = resetPasswordExpire;

        await user.save();

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}&email=${user.email}`;

        const message = `
          <h1>Password Reset Request</h1>
          <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
          <p>Please click on the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
        `;
        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Token",
                text: message,
            });

            res.status(200).json({
                success: true,
                message: "Email sent",
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({
                success: false,
                message: "Email could not be sent",
            })
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    const {resetToken} = req.params;
    const {password} = req.body;

    try {
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            })
        }

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: {$gt: Date.now()},
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            })
        }

        // Set new password
        user.password = await hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password-mobile
// @access  Public
exports.forgotPasswordMobile = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return next(new ErrorResponse(404, "User not found"));
        }

        // Get reset token
        const resetPasswordToken = generateResetPasswordToken();
        const resetPasswordExpire = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = resetPasswordExpire;

        await user.save();

        // Create reset url
        const resetUrl = `http://10.0.2.2:8080/redirect-reset/${resetPasswordToken}`;

        const message = `
          <h1>Password Reset Request</h1>
          <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
          <p>Please click on the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Token",
                text: message,
            });

            res.status(200).json({
                success: true,
                message: "Email sent",
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return next(new ErrorResponse(500, "Email could not be sent"));
        }
    } catch (error) {
        next(error);
    }
};