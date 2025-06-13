import Subcategory from '../models/subCategory.js';

// Get subcategories by parent category
export const getSubcategoriesByParent = async (parentId) => {
  return await Subcategory.findAll({
    where: { parentId }
  });
};

// Create subcategory
export const createSubcategory = async (data) => {
  return await Subcategory.create(data);
};
