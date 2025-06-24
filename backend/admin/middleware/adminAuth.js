// // admin/controllers/adminControllers.js

// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
//  // Sequelize model: make sure Admin is exported in your models/index.js
// import { Op } from 'sequelize';

// // Show registration form (GET)
// export const showRegister = (req, res) => {
//   res.render('register');
// };

// // Handle admin registration (POST)
// export const registerAdmin = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const existingAdmin = await Admin.findOne({ where: { email } });
//     if (existingAdmin) {
//       return res.render('register', { errorMessage: 'Email already exists' });
//     }
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.render('register', { errorMessage: 'Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await Admin.create({ name, email, password: hashedPassword });
//     res.redirect('/admin/login');
//   } catch (error) {
//     console.error('Error registering admin:', error);
//     res.render('register', { errorMessage: 'Server error' });
//   }
// };

// // Show login form (GET)
// export const showLogin = (req, res) => {
//   res.render('login');
// };

// // Handle admin login (POST)
// export const loginAdmin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await Admin.findOne({ where: { email } });
//     if (!admin) {
//       return res.render('login', { errorMessage: 'Admin not found' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res.render('login', { errorMessage: 'Invalid password' });
//     }
//     const payload = { admin: { id: admin.id } };
//     const jwtSecret = process.env.JWT_SECRET || "your-default-secret";
//     jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       res.cookie('token', token, { httpOnly: true });
//       res.redirect('/admin/dashboard');
//     });
//   } catch (error) {
//     console.error('Error logging in admin:', error);
//     res.render('login', { errorMessage: 'Server error' });
//   }
// };

// // Show admin dashboard (GET)
// export const showDashboard = async (req, res) => {
//   try {
//     const admin = await Admin.findByPk(req.admin.id, { attributes: { exclude: ['password'] } });
//     if (!admin) {
//       return res.status(404).send('Admin not found');
//     }
//     res.render('dashboard', { admin });
//   } catch (error) {
//     console.error('Error fetching admin:', error);
//     res.status(500).send('Server error');
//   }
// };

// // Show admin profile (GET)
// export const showProfile = async (req, res) => {
//   try {
//     const admin = await Admin.findByPk(req.admin.id, { attributes: { exclude: ['password'] } });
//     if (!admin) {
//       return res.status(404).send('Admin not found');
//     }
//     res.render('profile', { admin });
//   } catch (error) {
//     console.error('Error fetching admin:', error);
//     res.status(500).send('Server error');
//   }
// };

// // Handle admin profile update (POST)
// export const updateProfile = async (req, res) => {
//   try {
//     const { name, bio } = req.body;
//     const picture = req.file ? '/images/' + req.file.filename : undefined;
//     const update = { name, bio };
//     if (picture) update.picture = picture;
//     const [affectedRows, [admin]] = await Admin.update(update, {
//       where: { id: req.admin.id },
//       returning: true,
//       individualHooks: true
//     });
//     if (!admin) {
//       return res.status(404).send('Admin not found');
//     }
//     res.render('profile', { admin, successMessage: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error updating admin profile:', error);
//     res.status(500).send('Server error');
//   }
// };

// // Handle admin logout (GET)
// export const logoutAdmin = (req, res) => {
//   res.clearCookie('token');
//   res.redirect('/admin/login');
// };
