const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const blacklist = new Set();

class AuthService {
  static async register(userData) {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Usuário já existe', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    const token = this.generateToken(newUser._id);
    
    return {
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    };
  }

  static async login(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Senha incorreta', 401);
    }

    const token = this.generateToken(user._id);
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    };
  }

  static async logout(token) {
    if (!token) {
      throw new AppError('Token não fornecido', 401);
    }

    blacklist.add(token);
    return { message: 'Logout realizado com sucesso' };
  }

  static isTokenBlacklisted(token) {
    return blacklist.has(token);
  }

  static async verifyToken(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return { valid: true, user };
  }

  static generateToken(userId) {
    return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
  }
}

module.exports = AuthService; 