import {
  createProduct,
  getAllProducts,
  getBestProductsPaginated,
  searchProducts,
  getProductsByCategoryAndSubcategory,
  getProductsBySubcategoryId,
  getSimilarProducts,
  getProductById,
  updateProductById
} from '../services/productServices.js';

// Product controllers
const createProductHandler = async (req, res) => {
  try {
    const product = await createProduct(req.body, req.file?.filename);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProductsHandler = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBestProductsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 4 } = req.query;
    const { count, rows } = await getBestProductsPaginated(page, limit);
    
    res.json({
      products: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchProductsHandler = async (req, res) => {
  try {
    const searchQuery = req.query.query?.trim();
    if (!searchQuery) return res.json([]);
    
    const products = await searchProducts(searchQuery);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsByCategoryHandler = async (req, res) => {
  try {
    const products = await getProductsByCategoryAndSubcategory(
      req.params.categoryId,
      req.query.subcategoryId
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsBySubcategoryHandler = async (req, res) => {
  try {
    const products = await getProductsBySubcategoryId(req.params.subcategoryId);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSimilarProductsHandler = async (req, res) => {
  try {
    const similarProducts = await getSimilarProducts(req.params.id);
    res.json(similarProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductByIdHandler = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    product ? res.json(product) : res.status(404).json({ message: "Product not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    const updatedProduct = await updateProductById(
      req.params.id,
      req.body,
      req.file?.filename
    );
    res.json(updatedProduct);
  } catch (err) {
    const status = err.message === 'Product not found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

export {
  createProductHandler,
  getAllProductsHandler,
  getBestProductsHandler,
  searchProductsHandler,
  getProductsByCategoryHandler,
  getProductsBySubcategoryHandler,
  getSimilarProductsHandler,
  getProductByIdHandler,
  updateProductHandler
};
