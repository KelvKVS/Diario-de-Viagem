const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travel.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Rotas públicas
router.get('/public', travelController.getPublicTravels);

// Rotas privadas (usuário autenticado)
router.post('/', authMiddleware, travelController.createTravel);
router.get('/me', authMiddleware, travelController.getUserTravels);
// (opcional) editar, deletar etc depois

module.exports = router;