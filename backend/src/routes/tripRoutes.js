const express = require('express');
const router = express.Router();
const viagemController = require('../controllers/tripController');

// Buscar viagens com filtros
router.get('/viagens', viagemController.getViagens);

module.exports = router;