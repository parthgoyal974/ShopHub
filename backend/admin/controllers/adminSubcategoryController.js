import Subcategory from '../../models/subCategory.js';
import { getAllCategories } from '../../services/categoryServices.js';

// List all subcategories
import Category from '../../models/category.js';

export const renderSubcategoryList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 4;
    const offset = (page - 1) * limit;

    // Include parent category for display
    const { count, rows: subcategories } = await Subcategory.findAndCountAll({
      include: [{ model: Category }],
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.render('subcategories', {
      subcategories,
      pagination: { page, totalPages },
      activePage: 'subcategories'
    });
  } catch (err) {
    res.status(500).send('Error loading subcategories');
  }
};


// Render add subcategory form
export const renderAddSubcategory = async (req, res) => {
  const categories = await getAllCategories();
  res.render('subcategoryForm', {
    subcategory: {},
    categories,
    formAction: '/admin/subcategories/add',
    formTitle: 'Add Subcategory',
    activePage: 'subcategories'
  });
};

// Handle add subcategory
export const handleAddSubcategory = async (req, res) => {
  try {
    await Subcategory.create({
      name: req.body.name,
      parentId: req.body.parentId
    });
    res.redirect('/admin/subcategories');
  } catch (err) {
    res.status(500).send('Failed to add subcategory');
  }
};

// Render edit subcategory form
export const renderEditSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) return res.status(404).send('Subcategory not found');
    const categories = await getAllCategories();
    res.render('subcategoryForm', {
      subcategory,
      categories,
      formAction: `/admin/subcategories/edit/${subcategory.id}?_method=PUT`,
      formTitle: 'Edit Subcategory',
      activePage: 'subcategories'
    });
  } catch (err) {
    res.status(500).send('Error loading subcategory');
  }
};

// Handle edit subcategory
export const handleEditSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) return res.status(404).send('Subcategory not found');
    subcategory.name = req.body.name;
    subcategory.parentId = req.body.parentId;
    await subcategory.save();
    res.redirect('/admin/subcategories');
  } catch (err) {
    res.status(500).send('Failed to update subcategory');
  }
};

// Handle delete subcategory
export const handleDeleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) return res.status(404).send('Subcategory not found');
    await subcategory.destroy();
    res.redirect('/admin/subcategories');
  } catch (err) {
    res.status(500).send('Failed to delete subcategory');
  }
};
