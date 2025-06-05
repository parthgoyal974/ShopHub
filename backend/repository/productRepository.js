import Product from '../models/product.js';

export const createProduct = async (productData, imageFilename) => {
  return await Product.create({
    ...productData,
    image: imageFilename
  });
};

export const getAllProducts = async () => {
  return await Product.findAll();
};

export const getProductsByCategory = async (category) => {
  return await Product.findAll({ where: { category } });
};

export const updateProductCategory = async (productId, newCategory) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');
  
  product.category = newCategory;
  await product.save();
  return product;
};

export const updateProductById = async (id, data, imageFilename) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  // Update fields if present in data
  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined) product.price = data.price;
  if (data.rating !== undefined) product.rating = data.rating;
  if (data.category !== undefined) product.category = data.category;
  if (imageFilename) product.image = imageFilename;

  await product.save();
  return product;
};


export const getBestProductsPaginated = async (page = 1, limit = 4) => {
  const offset = (page - 1) * limit;
  return await Product.findAndCountAll({
    order: [['rating', 'DESC']],
    limit,
    offset
  });
};
