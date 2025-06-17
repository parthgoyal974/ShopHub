import Users from '../models/users.js';
import OTP from '../models/otp.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// --- Email Transporter Setup ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- Helper Functions ---
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 15 minutes.`
    });
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw new Error('Failed to send OTP email');
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_KEY, { expiresIn: '3h' });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  return decoded.id;
};

// --- Registration ---
export const registerUser = async ({ username, email, password }) => {
  const existingUser = await Users.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await Users.create({ username, email, password: hashPassword, verified: false });

  await sendVerificationOTP(email); // Send OTP after registration
  return { user }; // No JWT yet
};

// --- Send OTP ---
export const sendVerificationOTP = async (email) => {
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.verified) throw new Error('User already verified');

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

  await OTP.destroy({ where: { email } }); // Remove previous OTPs
  await OTP.create({ email, otp, expiresAt });

  await sendOTPEmail(email, otp);
};

// --- Verify OTP ---
export const verifyOTP = async (email, otp) => {
  const otpRecord = await OTP.findOne({
    where: { email },
    order: [['createdAt', 'DESC']]
  });
  if (!otpRecord) throw new Error('OTP not found');
  if (otpRecord.otp !== otp) throw new Error('Invalid OTP');
  if (new Date() > otpRecord.expiresAt) throw new Error('OTP expired');

  await Users.update({ verified: true }, { where: { email } });
  await OTP.destroy({ where: { email } }); // Clean up OTP

  // Optionally, auto-login after verification:
  const user = await Users.findOne({ where: { email } });
  const token = generateToken(user.id);
  return { user, token };
};

// --- Login ---
export const loginUser = async ({ email, password }) => {
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  if (!user.verified) throw new Error('Email not verified');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');

  return generateToken(user.id);
};

// --- Authenticated User Fetch ---
export const getAuthenticatedUser = async (userId) => {
  return await Users.findByPk(userId);
};

// --- JWT Middleware ---
export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authorization required');
    req.userId = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
