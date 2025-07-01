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
import Product from '../../models/product.js';
import Category from '../../models/category.js';
import Subcategory from '../../models/subCategory.js';
import { Op } from 'sequelize';

// List products with optional filters
export const renderProductList = async (req, res) => {
  try {
    const { category, subcategory, search, page = 1 } = req.query;
    const limit = 4; // number of products per page
    const offset = (page - 1) * limit;

    // Build where clause based on filters
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) where.categoryId = category;
    if (subcategory) where.subcategoryId = subcategory;

    // Query products with pagination and includes
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'subcategory' }
      ],
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    const categories = await getAllCategories();
    let subcategories = [];
    if (category) {
      subcategories = await getSubcategoriesByParent(category);
    }

    const totalPages = Math.ceil(count / limit);

    res.render('products', {
      products,
      categories,
      subcategories,
      filters: { category, subcategory, search },
      pagination: { page: Number(page), totalPages },
      activePage: 'products'
    });
  } catch (err) {
    console.log(err)
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
