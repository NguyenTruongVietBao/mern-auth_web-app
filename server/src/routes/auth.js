const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  checkAuth,
  resetPassword,
  changePassword,
  verifyEmail,
  forgotPasswordMobile,
  resendVerificationToken,
  refreshToken,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshToken);
router.get("/me", protect, authorize("ADMIN", "USER"), getMe);
router.get("/check-auth", protect, authorize("ADMIN", "USER"), checkAuth);
router.get("/check-auth-admin", protect, authorize("ADMIN"), checkAuth);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-mobile", forgotPasswordMobile);
router.put("/reset-password/:resetToken", resetPassword);
router.put(
  "/change-password",
  protect,
  authorize("ADMIN", "USER"),
  changePassword
);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token/:email", resendVerificationToken);

module.exports = router;
