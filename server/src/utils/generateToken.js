const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const parseDuration = (durationStr) => {
    const match = durationStr.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error("Invalid duration format (e.g., 15m, 30s)");

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: throw new Error("Invalid time unit");
    }
};

const accessTokenExpiresInMs = parseDuration(process.env.ACCESS_TOKEN_EXPIRES_IN);
const refreshTokenExpiresInMs = parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN);

const accessTokenCookieOptions = {
    httpOnly: true, // ngăn JavaScript truy cập.
    secure: process.env.NODE_ENV === "production",  // đảm bảo cookie chỉ gửi qua HTTPS.
    sameSite: "strict", //để ngăn cookie gửi trong các yêu cầu cross-site
    path: "/",
    maxAge: accessTokenExpiresInMs,
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: refreshTokenExpiresInMs,
};

const generateAccessToken = (res, userId) => {
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:  process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
};

const generateRefreshToken = (res, userId) => {
    return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

};

const decodeRefreshToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (err) {
        return null;
    }
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
};

const generateVerifyEmailToken = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const generateResetPasswordToken = () => {
    return crypto.randomBytes(32).toString("hex");

};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    generateVerifyEmailToken,
    generateResetPasswordToken,
    verifyRefreshToken,
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    decodeRefreshToken
};

