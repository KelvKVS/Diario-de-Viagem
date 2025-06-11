const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Get comments for a post
router.get('/post/:postId', authMiddleware, commentController.getComments);

// Add a comment to a post
router.post('/post/:postId', authMiddleware, commentController.addComment);

// Update a comment
router.put('/post/:postId/comment/:commentId', authMiddleware, commentController.updateComment);

// Delete a comment
router.delete('/post/:postId/comment/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router; 