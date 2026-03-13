const express = require('express');
const router = express.Router();
const { register, login, getMe, verifyOTP, resendOTP, forgotPassword, resetPassword, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, getAllUsers);

module.exports = router;
