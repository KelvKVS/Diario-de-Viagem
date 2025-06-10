const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const blacklist = new Set();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const novoUsuario = new Usuario({ name, email, password: hashedPassword });
    await novoUsuario.save();
    
    // Generate token after successful registration
    const token = jwt.sign({ userId: novoUsuario._id }, SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        _id: novoUsuario._id,
        name: novoUsuario.name,
        email: novoUsuario.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Erro no registro', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ userId: usuario._id }, SECRET, { expiresIn: '1h' });
    res.status(200).json({ 
      token,
      user: {
        _id: usuario._id,
        name: usuario.name,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro no login', details: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    blacklist.add(token);
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
};

exports.isTokenBlacklisted = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (blacklist.has(token)) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  next();
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await Usuario.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ valid: false, message: "Usuário não encontrado" });
    }
    res.json({ valid: true, user });
  } catch (err) {
    res.status(500).json({ valid: false, message: "Erro ao verificar token" });
  }
};