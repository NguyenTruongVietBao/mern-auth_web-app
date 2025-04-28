const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    verifyEmail, forgotPasswordMobile, resendVerificationToken,
} = require("../controllers/auth");
const {protect, authorize} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, authorize('ADMIN', 'USER'), getMe);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-mobile", forgotPasswordMobile);
router.put("/reset-password/:resetToken", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token/:email", resendVerificationToken);

module.exports = router;
