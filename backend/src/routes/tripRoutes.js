const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadTrip, handleMulterError } = require('../config/multer');

// Create trip with image upload
router.post('/', authMiddleware, uploadTrip.single('coverImage'), handleMulterError, tripController.createTrip);

// Get all trips
router.get('/', tripController.getTrips);

// Get trip by ID
router.get('/:id', tripController.getTripById);

// Update trip with image upload
router.put('/:id', authMiddleware, uploadTrip.single('coverImage'), handleMulterError, tripController.updateTrip);

// Delete trip
router.delete('/:id', authMiddleware, tripController.deleteTrip);

// Add member to trip
router.post('/:id/members', authMiddleware, tripController.addMember);

// Remove member from trip
router.delete('/:id/members/:memberId', authMiddleware, tripController.removeMember);

module.exports = router;