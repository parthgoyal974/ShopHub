import Product from '../models/product.js';
import Category from '../models/category.js';

// Create a product
export const createProduct = async (productData, imageFilename) => {
  return await Product.create({
    ...productData,
    image: imageFilename
  });
};

// Get all products (with category info)
export const getAllProducts = async () => {
  return await Product.findAll({
    include: [{ model: Category, as: "category" }]
  });
};

// Get a single product by id (with category info)
export const getProductById = async (id) => {
  return await Product.findByPk(id, {
    include: [{ model: Category, as: "category" }]
  });
};

// Get products by categoryId (with category info)
export const getProductsByCategoryId = async (categoryId) => {
  return await Product.findAll({
    where: { categoryId },
    include: [{ model: Category, as: "category" }]
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
  if (imageFilename) product.image = imageFilename;

  await product.save();
  return await Product.findByPk(id, {
    include: [{ model: Category, as: "category" }]
  });
};

// Get best products (paginated, sorted by rating DESC)
export const getBestProductsPaginated = async (page = 1, limit = 4) => {
  const offset = (page - 1) * limit;
  return await Product.findAndCountAll({
    order: [['rating', 'DESC']],
    limit,
    offset,
    include: [{ model: Category, as: "category" }]
  });
};
