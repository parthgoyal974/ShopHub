import Product from '../models/product.js';
import Category from '../models/category.js';
import Subcategory from '../models/subCategory.js';

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
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined) product.price = data.price;
  if (data.rating !== undefined) product.rating = data.rating;
  if (data.categoryId !== undefined) product.categoryId = data.categoryId;
  if (data.subcategoryId !== undefined) product.subcategoryId = data.subcategoryId;
  if (imageFilename) product.image = imageFilename;

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
