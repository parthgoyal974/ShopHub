import Product from '../models/product.js';
import Category from '../models/category.js';
import Subcategory from '../models/subCategory.js';
import Fuse from 'fuse.js';
import { Op } from "sequelize";

// Create a product
export const createProduct = async (productData, imageFilename) => {
  return await Product.create({
    ...productData,
    image: imageFilename
  });
};

// Get all products (with category and subcategory info)
export const getAllProducts = async () => {
  return await Product.findAll({
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });
};

// Get a single product by id (with category and subcategory info)
export const getProductById = async (id) => {
  return await Product.findByPk(id, {
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });
};

// Get products by categoryId (optionally filter by subcategoryId)
export const getProductsByCategoryAndSubcategory = async (categoryId, subcategoryId) => {
  const where = { categoryId };
  if (subcategoryId) where.subcategoryId = subcategoryId;

  return await Product.findAll({
    where,
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });
};

// Get products by subcategoryId only
export const getProductsBySubcategoryId = async (subcategoryId) => {
  return await Product.findAll({
    where: { subcategoryId },
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });
};

// Update a product by id
export const updateProductById = async (id, data, imageFilename) => {
  if (data.subcategoryId === '') {
      data.subcategoryId = null;
    }
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined) product.price = data.price;
  if (data.rating !== undefined) product.rating = data.rating;
  if (data.categoryId !== undefined) product.categoryId = data.categoryId;
  if (data.subcategoryId !== undefined) product.subcategoryId = data.subcategoryId;
  if (imageFilename) product.image = imageFilename;
  if (data.description !== undefined) product.description = data.description; 

  await product.save();
  return await Product.findByPk(id, {
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });
};

// Get best products (paginated, sorted by rating DESC)
export const getBestProductsPaginated = async (page = 1, limit = 4) => {
  const offset = (page - 1) * limit;
  return await Product.findAndCountAll({
    order: [['rating', 'DESC']],
    limit,
    offset,
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });
};
export const getSimilarProducts = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

  const where = {
    id: { [Op.ne]: productId }
  };

  if (product.subcategoryId) {
    where.subcategoryId = product.subcategoryId;
  } else {
    where.categoryId = product.categoryId;
  }

  let similarProducts = await Product.findAll({
    where,
    limit: 4,
    include: [
      { model: Category, as: "category" },
      { model: Subcategory, as: "subcategory" }
    ]
  });

  // Fallback: If no similar products in subcategory, try by category only
  if (similarProducts.length === 0) {
    similarProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: productId }
      },
      limit: 4,
      include: [
        { model: Category, as: "category" },
        { model: Subcategory, as: "subcategory" }
      ]
    });
  }

  return similarProducts;
};



export const searchProducts = async (query) => {
  try {
    // Get all products first
    const allProducts = await Product.findAll({
      include: [
        { model: Category, as: "category" },
        { model: Subcategory, as: "subcategory" }
      ]
    });

    // Convert Sequelize instances to plain objects
    const productsData = allProducts.map(product => product.get({ plain: true }));

    // Configure Fuse.js options
    const fuseOptions = {
      keys: ['name', 'description'],
      includeScore: true,
      threshold: 0.3,
      minMatchCharLength: 1,
      ignoreLocation: true,
      shouldSort: true,
    };

    const fuse = new Fuse(productsData, fuseOptions);
    const results = fuse.search(query.trim());

    // Return sorted results with original product data
    return results.map(result => ({
      ...result.item,
      matchScore: result.score // Optional: include match score if needed
    }));
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Search service unavailable');
  }
};
