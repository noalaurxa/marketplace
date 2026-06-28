const Product = require('../models/product');
const Category = require('../models/category');

/**
 * Get all products, optionally filtered by categoryId.
 */
async function getAllProducts(req, res) {
  const { categoryId } = req.query;
  const where = {};
  if (categoryId) where.categoryId = categoryId;
  try {
    const products = await Product.findAll({ where, include: [{ model: Category, as: 'category' }] });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

/** Get single product by ID */
async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, { include: [{ model: Category, as: 'category' }] });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

/** Create product – ADMIN only */
async function createProduct(req, res) {
  const { nombre, precio, descripcion, categoryId, imageUrl } = req.body;
  try {
    const product = await Product.create({ nombre, precio, descripcion, categoryId, imageUrl });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
}

/** Update product – ADMIN only */
async function updateProduct(req, res) {
  const { id } = req.params;
  const { nombre, precio, descripcion, categoryId, imageUrl } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    await product.update({ nombre, precio, descripcion, categoryId, imageUrl });
    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
}

/** Delete product – ADMIN only */
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
