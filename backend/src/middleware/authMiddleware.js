const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token não fornecido',
        message: 'É necessário fornecer um token de autenticação no formato Bearer'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado',
        message: 'O usuário associado a este token não existe mais'
      });
    }

    // Set user and userId in request
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Sua sessão expirou. Por favor, faça login novamente.',
        expiredAt: error.expiredAt
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'O token fornecido é inválido ou mal formatado'
      });
    }

    // Handle other unexpected errors
    return res.status(500).json({
      error: 'Erro de autenticação',
      message: 'Ocorreu um erro ao processar sua autenticação'
    });
  }
};

module.exports = authMiddleware;