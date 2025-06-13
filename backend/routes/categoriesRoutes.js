import express from 'express';
import {
  createCategoryHandler,
  getAllCategoriesHandler
} from '../controllers/categoryControllers.js';

const router = express.Router();

router.post('/', createCategoryHandler);
router.get('/', getAllCategoriesHandler);

export default router;
