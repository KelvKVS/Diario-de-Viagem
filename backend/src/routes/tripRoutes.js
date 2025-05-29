const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/trips', tripController.createTrip);
router.get('/trips', tripController.getTrips);
router.post('/trips/:tripId/add-member', tripController.addMember);
router.get('/my-trips', authMiddleware, tripController.getUserTrips);

module.exports = router;