import express from 'express';
import upload from '../middleware/multer.js';
import { 
  createProductHandler,
  getAllProductsHandler,
  getBestProductsHandler,
  searchProductsHandler,
  getProductsByCategoryHandler,
  getProductsBySubcategoryHandler,
  getSimilarProductsHandler,
  getProductByIdHandler,
  updateProductHandler
} from '../controllers/productControllers.js';

const router = express.Router();

// Product routes
router.post('/', upload.single('image'), createProductHandler);
router.get('/', getAllProductsHandler);
router.get('/best', getBestProductsHandler);
router.get('/search', searchProductsHandler);
router.get('/category/:categoryId', getProductsByCategoryHandler);
router.get('/subcategory/:subcategoryId', getProductsBySubcategoryHandler);
router.get('/:id/similar', getSimilarProductsHandler);
router.get('/:id', getProductByIdHandler);
router.put('/:id', upload.single('image'), updateProductHandler);

export default router;
