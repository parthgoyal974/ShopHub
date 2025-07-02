import express from 'express';
import {
  userRegister,
  userLogin,
  sendOTP,
  verifyOTPController,
  home,
  forgotPassword,
  resetPassword
} from "../controllers/authControllers.js";
import { verifyTokenMiddleware } from '../services/authServices.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP requests, please try again later.' }
});

// Registration and login
router.post('/register', userRegister);
router.post('/login', userLogin);

// Email verification OTP
router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', verifyOTPController);

// Forgot password (OTP to email)
router.post('/forgot-password', otpLimiter, forgotPassword);

// Reset password (verify OTP and set new password)
router.post('/reset-password', resetPassword);

// Authenticated home route (example protected route)
router.get('/home', verifyTokenMiddleware, home);

export default router;
