const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
  try {
    const { post, user, content } = req.body;

    if (!post || !user || !content) {
      return res.status(400).json({ error: 'Post, usuário e conteúdo são obrigatórios' });
    }

    const novoComentario = await Comment.create({ post, user, content });
    res.status(201).json(novoComentario);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar comentário', details: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comentarios = await Comment.find({ post: postId })
      .populate('user', 'name photo')
      .sort({ createdAt: -1 });
      
    res.status(200).json(comentarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários', details: err.message });
  }
};