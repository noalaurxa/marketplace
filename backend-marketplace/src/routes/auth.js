const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

// Returns current user from token — used by frontend middleware
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
