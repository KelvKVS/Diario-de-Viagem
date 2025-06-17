const Post = require('../models/post');
const Trip = require('../models/trip');
const path = require('path');
const fs = require('fs').promises;
const { AppError } = require('../middleware/errorHandler');
const PostService = require('../services/postService');

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { title, content, type, location } = req.body;

    const post = await PostService.createPost(
      tripId,
      req.user._id,
      { title, content, type, location },
      req.files
    );

    res.status(201).json(post);
  } catch (error) {
    // If there's an error, delete uploaded files
    if (req.files) {
      await Promise.all(req.files.map(file => 
        fs.unlink(file.path).catch(console.error)
      ));
    }
    next(error);
  }
};

// Get posts for a trip
exports.getTripPosts = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await PostService.getTripPosts(tripId, req.user._id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Add a comment to a post
exports.addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await PostService.addComment(postId, req.user._id, content);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    await PostService.deletePost(postId, req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get posts by user
exports.getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await PostService.getUserPosts(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get a single post by ID
exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await PostService.getPost(postId, req.user._id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};