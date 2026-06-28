const Category = require('../models/category');

/** Get all categories */
async function getAllCategories(req, res) {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

/** Create category – ADMIN only */
async function createCategory(req, res) {
  const { name, imageUrl } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  try {
    const category = await Category.create({ name, imageUrl });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
}

module.exports = { getAllCategories, createCategory };
