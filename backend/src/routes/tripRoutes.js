const express = require('express');
const router = express.Router();
const viagemController = require('../controllers/tripController');

router.get('/trips', viagemController.getViagens);

module.exports = router;