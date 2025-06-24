import express from 'express';
import {
  renderSubcategoryList,
  renderAddSubcategory,
  handleAddSubcategory,
  renderEditSubcategory,
  handleEditSubcategory,
  handleDeleteSubcategory
} from '../controllers/adminSubcategoryController.js';

const router = express.Router();

router.get('/', renderSubcategoryList);
router.get('/add', renderAddSubcategory);
router.post('/add', handleAddSubcategory);
router.get('/edit/:id', renderEditSubcategory);
router.put('/edit/:id', handleEditSubcategory);
router.post('/edit/:id', handleEditSubcategory); // fallback for method-override
router.post('/delete/:id', handleDeleteSubcategory);

export default router;
