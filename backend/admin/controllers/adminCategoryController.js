import { getAllCategories, createCategory } from '../../services/categoryServices.js';
import Category from '../../models/category.js';

// List all categories
export const renderCategoryList = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { categories, activePage: 'categories' });
  } catch (err) {
    res.status(500).send('Error loading categories');
  }
};

// Render add category form
export const renderAddCategory = (req, res) => {
  res.render('categoryForm', {
    category: {},
    formAction: '/admin/categories/add',
    formTitle: 'Add Category',
    activePage: 'categories'
  });
};

// Handle add category
export const handleAddCategory = async (req, res) => {
  try {
    await createCategory(req.body.name);
    res.redirect('/admin/categories');
  } catch (err) {
    console.log(err)
    res.status(500).send('Failed to add category');
  }
};

// Render edit category form
export const renderEditCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    res.render('categoryForm', {
      category,
      formAction: `/admin/categories/edit/${category.id}?_method=PUT`,
      formTitle: 'Edit Category',
      activePage: 'categories'
    });
  } catch (err) {
    res.status(500).send('Error loading category');
  }
};

// Handle edit category
export const handleEditCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    category.name = req.body.name;
    await category.save();
    res.redirect('/admin/categories');
  } catch (err) {
    console.log(err)
    res.status(500).send('Failed to update category');
  }
};

// Handle delete category
export const handleDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    await category.destroy();
    res.redirect('/admin/categories');
  } catch (err) {
    res.status(500).send('Failed to delete category');
  }
};
