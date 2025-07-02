import {
  registerUser,
  loginUser,
  getAuthenticatedUser,
  sendVerificationOTP,
  verifyOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOTPAndChangePassword
} from '../services/authServices.js';

// Register user (no JWT yet, only after verification)
const userRegister = async (req, res) => {
  try {
    const { user } = await registerUser(req.body);
    res.status(200).json({ message: "User registered. Please verify your email to continue." });
  } catch (err) {
    console.log(err)
    const status = err.message.includes('exists') ? 409 : 500;
    res.status(status).json({ message: err.message });
  }
};

// Login user (JWT only if verified)
const userLogin = async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (err) {
    let status = 500;
    if (err.message.includes('found')) status = 404;
    else if (err.message.includes('password')) status = 401;
    else if (err.message.includes('verified')) status = 403;
    res.status(status).json({ message: err.message });
  }
};

// Send OTP (for verification or resend)
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    await sendVerificationOTP(email);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    if (err.message === 'Failed to send OTP email') {
      res.status(503).json({ message: 'Could not send OTP email. Please try again later.' });
    } else if (err.message.includes('not found')) {
      res.status(404).json({ message: err.message });
    } else if (err.message.includes('verified')) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

// Verify OTP (issue JWT on success)
const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { user, token } = await verifyOTP(email, otp);
    res.status(200).json({ message: "Email verified successfully.", token });
  } catch (err) {
    let status = 400;
    if (err.message === 'Invalid OTP') status = 401;
    else if (err.message === 'OTP expired') status = 410;
    else if (err.message === 'OTP not found') status = 404;
    res.status(status).json({ message: err.message });
  }
};

// Home route (protected)
const home = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req.userId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// Forgot Password Feature
// ========================

// 1. Send OTP for password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await sendPasswordResetOTP(email);
    res.status(200).json({ message: "Password reset OTP sent successfully." });
  } catch (err) {
    if (err.message === 'Failed to send OTP email') {
      res.status(503).json({ message: 'Could not send OTP email. Please try again later.' });
    } else if (err.message.includes('not found')) {
      res.status(404).json({ message: err.message });
    } else if (err.message.includes('verified')) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

// 2. Verify OTP and reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    await verifyPasswordResetOTPAndChangePassword(email, otp, newPassword);
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    let status = 400;
    if (err.message === 'Invalid OTP') status = 401;
    else if (err.message === 'OTP expired') status = 410;
    else if (err.message === 'OTP not found') status = 404;
    res.status(status).json({ message: err.message });
  }
};

export {
  userRegister,
  userLogin,
  sendOTP,
  verifyOTPController,
  home,
  forgotPassword,
  resetPassword
};
