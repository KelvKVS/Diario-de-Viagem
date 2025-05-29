const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoUsuario = new Usuario({
      name,
      email,
      password: hashedPassword
    });

    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no registro' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ userId: usuario._id }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
};

const blacklist = new Set();

exports.logout = async (req, res) => {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // You could also add the token to a blacklist here if you want to invalidate it server-side
    
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Middleware para verificar se o token está na lista negra
exports.isTokenBlacklisted = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (blacklist.has(token)) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

exports.verifyToken = async (req, res) => {
  try {
    // Se chegou até aqui, significa que o token é válido (passou pelo authMiddleware)
    const userId = req.userId;
    const user = await Usuario.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        valid: false,
        message: 'Usuário não encontrado' 
      });
    }

    return res.status(200).json({ 
      valid: true,
      user: user 
    });
  } catch (error) {
    return res.status(500).json({ 
      valid: false,
      message: 'Erro ao verificar token' 
    });
  }
};
