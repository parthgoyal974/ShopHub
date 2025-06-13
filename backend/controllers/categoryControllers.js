import {
  createCategory,
  getAllCategories
} from '../services/categoryServices.js';

const createCategoryHandler = async (req, res) => {
  try {
    const category = await createCategory(req.body.name);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCategoriesHandler = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createCategoryHandler,
  getAllCategoriesHandler
};
