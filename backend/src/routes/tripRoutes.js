const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.post('/trips', tripController.createTrip);
router.get('/trips', tripController.getTrips);
router.post('/trips/:tripId/add-member', tripController.addMember);

module.exports = router;
