const User = require("../models/User");
const {verifyAccessToken, verifyRefreshToken, generateAccessToken, accessTokenCookieOptions, generateRefreshToken,
    refreshTokenCookieOptions
} = require("../utils/generateToken");

const extractTokenFromRequest = (req) => {
    if (req.headers.authorization?.startsWith("Bearer")) {
        console.log('Access Token get from Header')
        return req.headers.authorization.split(" ")[1];
    }
    if (req.cookies?.accessToken) {
        console.log('Access Token get from Cookie')
        return req.cookies.accessToken;
    }
    return null;
};

const handleTokenRefresh = async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token not found. Please log in again.",
        })
    }

    const refreshDecoded = verifyRefreshToken(refreshToken)
    if (!refreshDecoded) {
        return res.status(401).json({
            success: false,
            message: "Token expired. Please log in again.",
        })
    }

    try {
        const user = await User.findById(refreshDecoded.userId)
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid session. Please log in again.",
            })
        }
        const newAccessToken = generateAccessToken(res, user._id);
        const newRefreshToken = generateRefreshToken(res, user._id);
        user.refreshToken = newRefreshToken;

        await user.save();

        res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);
        res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

        req.user = user
        console.log('Correct Refresh Token - Passed Middleware')
        next()
    } catch (error) {
        console.error("Token refresh error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to refresh authentication",
        })
    }
}

protect = async (req, res, next) => {
    try {
        // 1. Extract token from request
        const token = extractTokenFromRequest(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login.",
            });
        }

        // 2. Verify accessToken
        const decoded = verifyAccessToken(token);

        // 3. If accessToken is valid, proceed
        if (decoded) {
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found or deleted",
                });
            }
            console.log('Correct Access Token - Passed Middleware')
            req.user = user;
            return next();
        }

        // 4. If access token is invalid/expired, try refresh token
        console.log('Access token expired, trying refresh token...')
        await handleTokenRefresh(req, res, next)

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Please log in again.",
        });
    }
};


// Role-based authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required for this action",
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Permission denied. Required role: ${roles.join(" or ")}`,
            })
        }

        next()
    }
}

module.exports = {protect, authorize};
