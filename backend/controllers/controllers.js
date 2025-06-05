import User from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register user
const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashPassword });
    const user = await User.findOne({ where: { email } });
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '3h' });
    return res.status(200).json({ message: "User created successfully",token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Login user
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '3h' });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded)
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Home route
const home = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  userRegister,
  userLogin,
  verifyToken,
  home
};
