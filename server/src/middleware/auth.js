const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const {verifyAccessToken} = require("../utils/generateToken");

protect = async (req, res, next) => {
    let token;

    // Check for token in cookies or Authorization header
    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ErrorResponse(false, 401, "Not authorized, no token"));
    }

    try {
        const decoded = verifyAccessToken(token)
        if (!decoded) {
            return next(new ErrorResponse(false, 401, "Not authorized, invalid token"));
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return next(new ErrorResponse(false, 400, "User not found"));
        }

        req.user = user;

        next();
    } catch (err) {
        return next(new ErrorResponse(false, 401, "Not authorized to access this route"));
    }
};

// Role-based authorization
authorize = (...roles) => {
    return (req, res, next) => {
        console.log('req.user', req.user)
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(false, 403, `${req.user.role} is not authorized to access this route`)
            );
        }
        next();
    };
};

module.exports = {protect, authorize};
