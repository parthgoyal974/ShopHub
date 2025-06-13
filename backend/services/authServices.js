import User from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashPassword });
  const token = generateToken(user.id);
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');

  return generateToken(user.id);
};

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

export const getAuthenticatedUser = async (userId) => {
  return await User.findByPk(userId);
};

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_KEY, { expiresIn: '3h' });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  return decoded.id;
};
