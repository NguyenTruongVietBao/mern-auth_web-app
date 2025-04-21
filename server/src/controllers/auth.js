const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const {
    generateVerifyToken,
    generateJWTToken,
    generateResetToken,
} = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        if (userExists) {
            return next(new ErrorResponse(true, 400, "Email already registered"));
        }
        const user = new User({
            name,
            email,
            password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Generate verification token
        const verificationToken = generateVerifyToken();
        user.verificationToken = verificationToken;
        user.verificationTokenExpire = Date.now() + 3600000; // 1 hour

        // Send verification email
        try {
            await sendEmail({
                to: user.email,
                subject: "Email Verification",
                text: `
          <h1>Email Verification</h1>
          <p>Please enter this token to verify your account:</p>
          <h2>${verificationToken}</h2>
        `,
            });

            await user.save();

            res.status(200).json({
                success: true,
                message: "Verification email sent",
                user: user,
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorResponse(true, 500, "Email could not be sent"));
        }
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(true, 500, "Error when register"));
    }
};

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        const {verificationToken} = req.body;

        // Validate verification token
        if (!verificationToken) {
            return next(
                new ErrorResponse(true, 400, "Please provide a verification token")
            );
        }

        // Find user by verification token
        const user = await User.findOne({
            verificationToken,
            verificationTokenExpire: {$gt: Date.now()},
        });

        if (!user) {
            return next(new ErrorResponse(true, 400, "Invalid or expired token"));
        }

        // Set verified to true and clear verification tokens
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        return next(new ErrorResponse(true, 500, "Error when verify email"));
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        console.log("req.body", req.body);

        // Validate email & password
        if (!email || !password) {
            return next(
                new ErrorResponse(true, 400, "Please provide an email and password")
            );
        }

        // Check for user
        const user = await User.findOne({email});
        if (!user) {
            return next(new ErrorResponse(true, 400, "Invalid email"));
        }
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ErrorResponse(true, 401, "Invalid password"));
        }
        // Check Email is verified
        const isVerified = user.isVerified;
        if (!isVerified) {
            return next(new ErrorResponse(true, 400, "Email not verified"));
        }
        const accessToken = generateJWTToken(res, user._id);

        res.status(200).json({
            success: true,
            message: "Login successfull",
            user: user,
            accessToken: accessToken,
        });
    } catch (error) {
        return next(new ErrorResponse(true, 500, "Error when login"));
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorResponse(true, 404, "User not found"));
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
            return next(new ErrorResponse(true, 404, "User not found"));
        }

        // Get reset token
        const resetPasswordToken = generateResetToken();
        const resetPasswordExpire = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = resetPasswordExpire;

        await user.save();

        // Create reset url
        const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetPasswordToken}`;

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
            return next(new ErrorResponse(true, 500, "Email could not be sent"));
        }
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
            return next(new ErrorResponse(true, 404, "User not found"));
        }

        // Get reset token
        const resetPasswordToken = generateResetToken();
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
            return next(new ErrorResponse(true, 500, "Email could not be sent"));
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
            return next(new ErrorResponse(true, 400, "Password is required"));
        }
        if (password.length < 6) {
            return next(
                new ErrorResponse(true, 400, "Password must be at least 6 characters")
            );
        }

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: {$gt: Date.now()},
        });
        console.log("user", user);
        if (!user) {
            return next(new ErrorResponse(true, 400, "Invalid or expired token"));
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error);
    }
};
