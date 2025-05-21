const post = require('../models/posts.js');

exports.getposts = async (req, res) => {
  try {
    const { local, inicio, fim } = req.query;

    const filtros = {};

    if (local) {
      filtros.location = new RegExp(local, 'i');
    }

    if (inicio || fim) {
      filtros.date = {};

      if (inicio && !isNaN(new Date(inicio).getTime())) {
        filtros.date.$gte = new Date(inicio);
      }

      if (fim && !isNaN(new Date(fim).getTime())) {
        filtros.date.$lte = new Date(fim);
      }

      if (Object.keys(filtros.date).length === 0) {
        delete filtros.date;
      }
    }

    const posts = await post.find(filtros).populate('usuario');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar viagens', detalhes: err });
  }
};

exports.createPost = async (req, res) => {
  try {
    const dadosPost = req.body;

    if (!dadosPost.usuario) {
      return res.status(400).json({ erro: 'Usuário é obrigatório' });
    }

    const novoPost = await post.create(dadosPost);
    res.status(201).json(novoPost);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar post', detalhes: err.message });
  }
};