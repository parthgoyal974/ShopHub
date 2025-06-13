import {
  getSubcategoriesByParent,
  createSubcategory
} from '../services/subcategoryServices.js';

const getSubcategoriesByParentHandler = async (req, res) => {
  try {
    const subcategories = await getSubcategoriesByParent(req.params.parentId);
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSubcategoryHandler = async (req, res) => {
  try {
    const subcategory = await createSubcategory(req.body);
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export {
  getSubcategoriesByParentHandler,
  createSubcategoryHandler
};
