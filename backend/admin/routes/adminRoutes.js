import express from 'express';
import adminProductRoutes from './adminProductRoutes.js';
import adminCategoryRoutes from './adminCategoryRoutes.js';
import { adminDashboard } from '../controllers/adminDashboardController.js';
import adminSubcategoryRoutes from './adminSubcategoryRoutes.js';
import adminUserRoutes from './adminUserRoutes.js';
import adminOrderRoutes from './adminOrderRoutes.js';

const router = express.Router();

router.get('/', adminDashboard);
router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/subcategories', adminSubcategoryRoutes);
router.use('/users', adminUserRoutes);
router.use('/orders', adminOrderRoutes);

export default router;
