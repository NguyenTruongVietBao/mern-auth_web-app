const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    verifyEmail, forgotPasswordMobile,
} = require("../controllers/auth");
const {protect} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-mobile", forgotPasswordMobile);
router.put("/reset-password/:resetToken", resetPassword);
router.post("/verify-email", verifyEmail);

module.exports = router;
