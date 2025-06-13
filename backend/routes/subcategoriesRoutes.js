import express from 'express';
import {
  getSubcategoriesByParentHandler,
  createSubcategoryHandler
} from '../controllers/subcategoryControllers.js';

const router = express.Router();

router.get('/by-category/:parentId', getSubcategoriesByParentHandler);
router.post('/', createSubcategoryHandler);

export default router;
