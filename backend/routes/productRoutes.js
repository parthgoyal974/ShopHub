import express from 'express';
import upload from '../middleware/multer.js';
import { verifyToken } from '../controllers/controllers.js';
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  updateProductById
} from '../repository/productRepository.js';

const router = express.Router();

// Create product
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const product = await createProduct(req.body, req.file.filename);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by category
router.get('/products/category/:category', async (req, res) => {
  try {
    const products = await getProductsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedProduct = await updateProductById(
      req.params.id,
      req.body,
      req.file ? req.file.filename : undefined
    );
    res.json(updatedProduct);
  } catch (err) {
    const statusCode = err.message === 'Product not found' ? 404 : 500;
    res.status(statusCode).json({ message: err.message });
  }
});




// GET /api/products/best?page=1&limit=4
router.get('/products/best', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    // Get total count of products (for pagination metadata)
    const { count, rows } = await Product.findAndCountAll({
      order: [['rating', 'DESC']],
      limit,
      offset
    });

    res.json({
      products: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
