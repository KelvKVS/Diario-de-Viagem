const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const postUpload = require('../middleware/postUploadMiddleware');

// Get a single post
router.get('/:postId', authMiddleware, postController.getPost);

// Get posts for a trip
router.get('/trip/:tripId', authMiddleware, postController.getTripPosts);

// Create a new post
router.post('/:tripId', authMiddleware, postUpload, postController.createPost);

// Add a comment to a post
router.post('/:postId/comments', authMiddleware, postController.addComment);

// Delete a post
router.delete('/:postId', authMiddleware, postController.deletePost);

// Get posts by user
router.get('/user/:userId', authMiddleware, postController.getUserPosts);

module.exports = router;
