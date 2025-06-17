const AuthService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await AuthService.logout(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.isTokenBlacklisted = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (AuthService.isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  next();
};

exports.verifyToken = async (req, res, next) => {
  try {
    const result = await AuthService.verifyToken(req.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};