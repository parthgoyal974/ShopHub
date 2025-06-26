import express from 'express';
import adminProductRoutes from './adminProductRoutes.js';
import adminCategoryRoutes from './adminCategoryRoutes.js';
import { adminDashboard } from '../controllers/adminDashboardController.js';
import adminSubcategoryRoutes from './adminSubcategoryRoutes.js';
import adminUserRoutes from './adminUserRoutes.js';
import adminOrderRoutes from './adminOrderRoutes.js';

const router = express.Router();
import { adminPasskeyMiddleware } from '../middleware/adminAuth.js';

// Show passkey form
router.get('/passkey', (req, res) => {
  res.render('adminPasskey', { error: null });
});

// Handle passkey form submission
router.post('/passkey', (req, res) => {
  const { passkey } = req.body;
  // Use a secure env variable for the admin passkey
  const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'letmein';

  if (passkey === ADMIN_PASSKEY) {
    req.session.adminAuthenticated = true;
    req.session.cookie.maxAge = 30 * 60 * 1000; // 30 minutes
    return res.redirect('/admin');
  } else {
    return res.render('adminPasskey', { error: 'Incorrect passkey.' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/passkey');
  });
});

// Protect all admin routes after this middleware
router.use(adminPasskeyMiddleware);
router.get('/', adminDashboard);
router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/subcategories', adminSubcategoryRoutes);
router.use('/users', adminUserRoutes);
router.use('/orders', adminOrderRoutes);

export default router;
