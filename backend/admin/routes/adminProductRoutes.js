import express from 'express';
import upload from '../../middleware/multer.js';
import {
  renderProductList,
  renderAddProduct,
  handleAddProduct,
  renderEditProduct,
  handleEditProduct
} from '../controllers/adminProductController.js';

const router = express.Router();

// List all products
router.get('/', renderProductList);

// Add product
router.get('/add', renderAddProduct);
router.post('/add', upload.single('image'), handleAddProduct);

// Edit product
router.get('/edit/:id', renderEditProduct);

// --- THIS IS THE CRUCIAL ROUTE ---
router.put('/edit/:id', upload.single('image'), handleEditProduct);
// ----------------------------------

// Optionally, for method-override fallback:
router.post('/edit/:id', upload.single('image'), handleEditProduct);

export default router;
