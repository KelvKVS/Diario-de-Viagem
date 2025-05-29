const Post = require('../models/post');

exports.getPosts = async (req, res) => {
  try {
    const { local, inicio, fim } = req.query;
    const filtros = {};

    if (local) filtros.location = new RegExp(local, 'i');
    
    if (inicio || fim) {
      filtros.date = {};
      if (inicio && !isNaN(new Date(inicio))) filtros.date.$gte = new Date(inicio);
      if (fim && !isNaN(new Date(fim))) filtros.date.$lte = new Date(fim);
      
      if (Object.keys(filtros.date).length === 0) delete filtros.date;
    }

    const posts = await Post.find(filtros).populate('user');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts', details: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const dadosPost = req.body;
    
    if (!dadosPost.user) {
      return res.status(400).json({ error: 'Usuário é obrigatório' });
    }

    const novoPost = await Post.create(dadosPost);
    res.status(201).json(novoPost);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar post', details: err.message });
  }
};