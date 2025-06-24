import express from 'express';
import {
  renderCategoryList,
  renderAddCategory,
  handleAddCategory,
  renderEditCategory,
  handleEditCategory,
  handleDeleteCategory
} from '../controllers/adminCategoryController.js';

const router = express.Router();

router.get('/', renderCategoryList);
router.get('/add', renderAddCategory);
router.post('/add', handleAddCategory);
router.get('/edit/:id', renderEditCategory);
router.put('/edit/:id', handleEditCategory);
router.post('/edit/:id', handleEditCategory); // fallback for method-override
router.post('/delete/:id', handleDeleteCategory);

export default router;
