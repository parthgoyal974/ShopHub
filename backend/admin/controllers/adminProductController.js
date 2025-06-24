import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  searchProducts,
  getProductsByCategoryAndSubcategory
} from '../../services/productServices.js';
import { getAllCategories } from '../../services/categoryServices.js';
import { getSubcategoriesByParent } from '../../services/subcategoryServices.js';

// List products with optional filters
export const renderProductList = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    let products;

    if (search) {
      products = await searchProducts(search);
    } else if (category) {
      products = await getProductsByCategoryAndSubcategory(category, subcategory);
    } else {
      products = await getAllProducts();
    }

    const categories = await getAllCategories();
    let subcategories = [];
    if (category) {
      subcategories = await getSubcategoriesByParent(category);
    }

    res.render('products', {
      products,
      categories,
      subcategories,
      filters: { category, subcategory, search },
      activePage: 'products'
    });
  } catch (err) {
    res.status(500).send('Error loading products');
  }
};

// Render add product form
export const renderAddProduct = async (req, res) => {
  const categories = await getAllCategories();
  res.render('productForm', {
    product: {},
    categories,
    subcategories: [],
    formAction: '/admin/products/add',
    formTitle: 'Add Product',
    activePage: 'products'
  });
};

// Handle add product POST
export const handleAddProduct = async (req, res) => {
  try {
    await createProduct(req.body, req.file?.filename);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Failed to add product');
  }
};

// Render edit product form
export const renderEditProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    const categories = await getAllCategories();
    let subcategories = [];
    if (product.categoryId) {
      subcategories = await getSubcategoriesByParent(product.categoryId);
    }
    res.render('productForm', {
      product,
      categories,
      subcategories,
      formAction: `/admin/products/edit/${product.id}`,
      formTitle: 'Edit Product',
      activePage: 'products'
    });
  } catch (err) {
    res.status(404).send('Product not found');
  }
};

// Handle edit product POST
export const handleEditProduct = async (req, res) => {
  try {
    await updateProductById(req.params.id, req.body, req.file?.filename);
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err)
    res.status(500).send('Failed to update product');
  }
};
