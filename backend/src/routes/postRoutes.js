const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
}).array('images', 5);

router.use(authMiddleware);

// Get posts for a trip
router.get('/:tripId/posts', postController.getTripPosts);

// Get posts by user
router.get('/user/:userId', postController.getUserPosts);

// Create a new post with file upload
router.post('/:tripId/posts', upload, postController.createPost);

// Add a comment to a post
router.post('/posts/:postId/comments', postController.addComment);

// Delete a post
router.delete('/posts/:postId', postController.deletePost);

module.exports = router;
