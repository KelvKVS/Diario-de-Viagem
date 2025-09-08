const Post = require('../models/post');
const Trip = require('../models/trip');
const path = require('path');
const fs = require('fs').promises;
const { AppError } = require('../middleware/errorHandler');

class PostService {
  static async validateTripAccess(tripId, userId) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    if (!trip.members.includes(userId)) {
      throw new AppError('Você não é membro desta viagem', 403);
    }

    return trip;
  }

  static async validatePostAccess(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }

    const trip = await Trip.findById(post.trip);
    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    const isAdmin = trip.admins.includes(userId);
    if (post.author.toString() !== userId && !isAdmin) {
      throw new AppError('Você não tem permissão para esta ação', 403);
    }

    return { post, trip };
  }

  static async createPost(tripId, userId, postData, files) {
    await this.validateTripAccess(tripId, userId);

    const images = files ? files.map(file => `/uploads/posts/${file.filename}`) : [];

    const post = await Post.create({
      trip: tripId,
      author: userId,
      ...postData,
      images
    });

    await post.populate('author', 'name email profilePhoto');
    return post;
  }

  static async getTripPosts(tripId, userId, page = 1, limit = 10) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    if (!trip.isPublic && !trip.members.includes(userId)) {
      throw new AppError('Acesso não autorizado', 403);
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ trip: tripId })
        .populate({
          path: 'author',
          select: 'name email profilePhoto'
        })
        .populate({
          path: 'comments.author',
          select: 'name email profilePhoto'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ trip: tripId })
    ]);

    const postsWithRoles = posts.map(post => {
      const postObj = post.toObject();
      const isAdmin = trip.admins.includes(post.author._id);
      postObj.author.role = isAdmin ? 'Administrador' : 'Membro';
      return postObj;
    });

    return {
      posts: postsWithRoles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async addComment(postId, userId, content) {
    if (!content || content.trim().length === 0) {
      throw new AppError('O comentário não pode estar vazio', 400);
    }

    const { post, trip } = await this.validatePostAccess(postId, userId);

    post.comments.push({
      author: userId,
      content: content.trim()
    });

    await post.save();
    await post.populate('comments.author', 'name email profilePhoto');
    return post;
  }

  static async deletePost(postId, userId) {
    const { post } = await this.validatePostAccess(postId, userId);

    if (post.images && post.images.length > 0) {
      await Promise.all(post.images.map(image => {
        const imagePath = path.join(__dirname, '../../', image);
        return fs.unlink(imagePath).catch(console.error);
      }));
    }

    await post.deleteOne();
  }

  static async getUserPosts(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: userId })
        .populate('author', 'name email profilePhoto')
        .populate('comments.author', 'name email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ author: userId })
    ]);

    return {
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getPost(postId, userId) {
    const post = await Post.findById(postId)
      .populate('author', 'name email profilePhoto')
      .populate('comments.author', 'name email profilePhoto');

    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }

    const trip = await Trip.findById(post.trip);
    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    if (!trip.isPublic && !trip.members.includes(userId)) {
      throw new AppError('Acesso não autorizado', 403);
    }

    const postObj = post.toObject();
    const isAdmin = trip.admins.includes(post.author._id);
    postObj.author.role = isAdmin ? 'Administrador' : 'Membro';

    return postObj;
  }
}

module.exports = PostService; 