const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postController');

router.get('/posts', postsController.getposts);
router.post('/posts', postsController.createPost);

module.exports = router;