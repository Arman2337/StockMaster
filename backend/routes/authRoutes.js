const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');


router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.post('/request-password-reset', authCtrl.requestPasswordReset);
router.post('/verify-otp-reset', authCtrl.verifyOtpAndReset);


module.exports = router;