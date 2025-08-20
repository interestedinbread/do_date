// routes/auth.js
const express = require('express');
const router = express.Router();
const { sendVerificationSMS, verifyPhoneNumber, checkPhoneVerification } = require('../controllers/authController');

// auth routes
router.post('/send-verification-sms', sendVerificationSMS);
router.post('/verify-phone', verifyPhoneNumber);
router.post('/check-phone-verification', checkPhoneVerification);

module.exports = router;