const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// CORS middleware for images
const corsHeaders = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CORS_ORIGIN || 'https://diario-de-viagem.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

// Middleware to check if file exists
const checkFileExists = async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    try {
      await fs.access(filePath);
      next();
    } catch (error) {
      res.status(404).json({ error: 'Imagem não encontrada' });
    }
  } catch (error) {
    console.error('Error checking file:', error);
    res.status(500).json({ error: 'Erro ao verificar arquivo' });
  }
};

// Get image by filename
router.get('/:filename', corsHeaders, checkFileExists, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);
  res.sendFile(filePath);
});

module.exports = router; 