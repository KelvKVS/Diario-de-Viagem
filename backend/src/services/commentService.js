const Post = require('../models/post');
const Trip = require('../models/trip');
const { AppError } = require('../middleware/errorHandler');

class CommentService {
  static async getComments(postId, userId) {
    const post = await Post.findById(postId);
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

    const populatedPost = await Post.findById(postId)
      .populate({
        path: 'comments.author',
        model: 'User',
        select: 'name email profilePhoto'
      });

    return populatedPost.comments;
  }

  static async addComment(postId, userId, content) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }

    const trip = await Trip.findById(post.trip);
    if (!trip.members.includes(userId)) {
      throw new AppError('Você não é membro desta viagem', 403);
    }

    post.comments.push({
      author: userId,
      content
    });

    await post.save();
    
    await post.populate({
      path: 'comments.author',
      select: 'name email profilePhoto'
    });

    return post.comments[post.comments.length - 1];
  }

  static async updateComment(postId, commentId, userId, content) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new AppError('Comentário não encontrado', 404);
    }

    if (comment.author.toString() !== userId.toString()) {
      throw new AppError('Não autorizado a editar este comentário', 403);
    }

    comment.content = content;
    await post.save();

    await post.populate({
      path: 'comments.author',
      select: 'name email profilePhoto'
    });

    return comment;
  }

  static async deleteComment(postId, commentId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new AppError('Comentário não encontrado', 404);
    }

    const trip = await Trip.findById(post.trip);
    if (comment.author.toString() !== userId.toString() && 
        !trip.admins.includes(userId)) {
      throw new AppError('Não autorizado a deletar este comentário', 403);
    }

    await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } }
    );

    return { message: 'Comentário deletado com sucesso' };
  }
}

module.exports = CommentService; 