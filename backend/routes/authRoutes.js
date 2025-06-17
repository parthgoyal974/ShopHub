import express from 'express';
import {
  userRegister,
  userLogin,
  sendOTP,
  verifyOTPController,
  home
} from "../controllers/authControllers.js";
import { verifyTokenMiddleware } from '../services/authServices.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP requests, please try again later.' }
});

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', verifyOTPController);
router.get('/home', verifyTokenMiddleware, home);


export default router;
