import express from 'express';
import Subcategory from '../models/subcategory.js';

const router = express.Router();

// Get subcategories by parent category
router.get('/by-category/:parentId', async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll({
      where: { parentId: req.params.parentId }
    });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create subcategory
router.post('/', async (req, res) => {
  try {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
