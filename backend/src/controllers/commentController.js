const Post = require('../models/post');
const Trip = require('../models/trip');

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    console.log('Getting comments for post:', req.params.postId);
    const { postId } = req.params;

    // First find the post without population
    const post = await Post.findById(postId);
    console.log('Found post:', post ? 'Yes' : 'No');

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Check if trip exists and user has access
    const trip = await Trip.findById(post.trip);
    console.log('Found trip:', trip ? 'Yes' : 'No');
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    console.log('Trip is public:', trip.isPublic);
    console.log('User is member:', trip.members.includes(req.user._id));

    if (!trip.isPublic && !trip.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Get the post again with populated comments
    const populatedPost = await Post.findById(postId)
      .populate({
        path: 'comments.author',
        model: 'User',
        select: 'name email profilePhoto'
      });

    console.log('Comments populated successfully');
    console.log('Number of comments:', populatedPost.comments.length);

    res.status(200).json(populatedPost.comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar comentários',
      details: error.message,
      stack: error.stack
    });
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
    
    // Populate the newly added comment's author
    await post.populate({
      path: 'comments.author',
      select: 'name email profilePhoto'
    });

    // Return the newly added comment
    const newComment = post.comments[post.comments.length - 1];
    res.status(200).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Não autorizado a editar este comentário' });
    }

    comment.content = content;
    await post.save();

    // Populate the updated comment's author
    await post.populate({
      path: 'comments.author',
      select: 'name email profilePhoto'
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Erro ao atualizar comentário' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    // Check if user is the author of the comment or an admin of the trip
    const trip = await Trip.findById(post.trip);
    if (comment.author.toString() !== req.user._id.toString() && 
        !trip.admins.includes(req.user._id)) {
      return res.status(403).json({ error: 'Não autorizado a deletar este comentário' });
    }

    comment.remove();
    await post.save();

    res.status(200).json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
}; 