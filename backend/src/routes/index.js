const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const tripRoutes = require('./tripRoutes');
const imageRoutes = require('./imageRoutes');
const userRoutes = require('./userRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/trips', authMiddleware, tripRoutes);
router.use('/images', imageRoutes);
router.use('/comments', commentRoutes);

router.get('/', (req, res) => {
  res.send('API do Diário de Viagens está funcionando!');
});

module.exports = router; 