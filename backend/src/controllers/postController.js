const Post = require('../models/post');
const Trip = require('../models/trip');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, content, type = 'text', location } = req.body;

    // Check if trip exists and user is a member
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    if (!trip.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Você não é membro desta viagem' });
    }

    const images = req.files ? req.files.map(file => file.filename) : [];

    const post = new Post({
      trip: tripId,
      author: req.user._id,
      title,
      content,
      type,
      location,
      images
    });

    await post.save();

    // Populate author information
    await post.populate('author', 'username email profilePicture');

    res.status(201).json({ post });
  } catch (error) {
    // If there's an error, delete uploaded files
    if (req.files) {
      await Promise.all(req.files.map(file => 
        fs.unlink(file.path).catch(console.error)
      ));
    }
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

// Get posts for a trip
exports.getTripPosts = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Check if trip exists and user has access
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    if (!trip.isPublic && !trip.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const posts = await Post.find({ trip: tripId })
      .populate('author', 'name email avatar')
      .populate('comments.author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Check if user is a member of the trip
    const trip = await Trip.findById(post.trip);
    if (!trip.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Você não é membro desta viagem' });
    }

    post.comments.push({
      author: req.user._id,
      content
    });

    await post.save();
    await post.populate('comments.author', 'name email avatar');

    res.status(200).json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Check if user is the author or an admin of the trip
    const trip = await Trip.findById(post.trip);
    if (post.author.toString() !== req.user._id.toString() && 
        !trip.admins.includes(req.user._id)) {
      return res.status(403).json({ error: 'Não autorizado a deletar este post' });
    }

    // Delete associated images
    if (post.images && post.images.length > 0) {
      await Promise.all(post.images.map(image => 
        fs.unlink(path.join('uploads', image)).catch(console.error)
      ));
    }

    await post.remove();
    res.status(200).json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
};

// Get posts by user
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate('author', 'name email avatar')
      .populate('comments.author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error getting user posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts do usuário' });
  }
};