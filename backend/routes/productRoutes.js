import express from 'express';
import upload from '../middleware/multer.js';

import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  updateProductById,
  getBestProductsPaginated
} from '../repository/productRepository.js';

const router = express.Router();

// Create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const product = await createProduct(req.body, req.file.filename);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products (with category info)
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// Get best products (paginated, sorted by rating DESC)
router.get('/best', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const { count, rows } = await getBestProductsPaginated(page, limit);

    res.json({
      products: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
});

// Get products by categoryId
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await getProductsByCategoryId(req.params.categoryId);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get a single product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product by id
router.put('/:id', upload.single('image'), async (req, res) => {
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



export default router;
