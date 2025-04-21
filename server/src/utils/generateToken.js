const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateJWTToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true, // cookie cannot be accessed by client side scripts
    secure: process.env.NODE_ENV === "production", // cookie will only be set on https
    sameSite: "strict", // cookie will only be set on the same site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

const verifyJWTToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const generateVerifyToken = () => {
  const token = crypto.randomInt(100000, 999999).toString();
  return token;
};

const generateResetToken = () => {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");
  return resetToken;
};

module.exports = {
  generateJWTToken,
  generateVerifyToken,
  generateResetToken,
  verifyJWTToken,
};
