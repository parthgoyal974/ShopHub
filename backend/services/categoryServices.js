import Category from '../models/category.js';

// Create a new category
export const createCategory = async (name) => {
  return await Category.create({ name });
};

// Get all categories
export const getAllCategories = async () => {
  return await Category.findAll();
};
