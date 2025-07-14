import { Router } from 'express';
import { requestOtpHandler, verifyOtpHandler, logoutHandler } from '@backend/controllers/authController';

const router = Router();

// Handles both registration and login request
router.post('/request-otp', requestOtpHandler);

// Verifies the OTP and logs the user in
router.post('/verify-otp', verifyOtpHandler);

// Logs the user out
router.post('/logout', logoutHandler);

export default router; 