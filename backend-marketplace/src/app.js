require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Routers
const authRouter = require('./routes/auth');
const productRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');

const app = express();

// CORS – allow frontend on localhost or Vercel
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:3000') ||
      origin.endsWith('.vercel.app') ||
      origin === process.env.FRONTEND_URL
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRouter);

// Product & Category routes (protected logic handled inside routers)
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce funcionando' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Database sync and Server start
const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

module.exports = app;

