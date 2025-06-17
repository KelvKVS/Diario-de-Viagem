const Post = require('../models/post');
const Trip = require('../models/trip');
const CommentService = require('../services/commentService');

// Get comments for a post
exports.getComments = async (req, res, next) => {
  try {
    const comments = await CommentService.getComments(req.params.postId, req.user._id);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Add a comment to a post
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await CommentService.addComment(req.params.postId, req.user._id, content);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Update a comment
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await CommentService.updateComment(
      req.params.postId,
      req.params.commentId,
      req.user._id,
      content
    );
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
exports.deleteComment = async (req, res, next) => {
  try {
    const result = await CommentService.deleteComment(
      req.params.postId,
      req.params.commentId,
      req.user._id
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}; 