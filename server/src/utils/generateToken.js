const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const accessTokenCookieOptions = {
    httpOnly: true, // ngăn JavaScript truy cập.
    secure: process.env.NODE_ENV === "production",  // đảm bảo cookie chỉ gửi qua HTTPS.
    sameSite: "strict", //để ngăn cookie gửi trong các yêu cầu cross-site (giảm nguy cơ CSRF).
    path: "/",
    maxAge: 15 * 60 * 1000, // 15'
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 60 * 60 * 1000, // 7 ngày
};

const generateAccessToken = (res, userId) => {
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 60 * 60 * 1000,
    });
};

const generateRefreshToken = (res, userId) => {
    return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 7 * 60 * 60 * 1000,
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
