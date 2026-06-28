const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Public endpoint: list all categories
router.get('/', categoryController.getAllCategories);

// Admin-only endpoint: create a new category
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), categoryController.createCategory);

module.exports = router;
