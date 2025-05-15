const Viagem = require('../models/trip.js');

exports.getViagens = async (req, res) => {
  try {
    const { local, inicio, fim } = req.query;

    const filtros = {};

    if (local) {
      filtros.local = new RegExp(local, 'i'); 
    }

    if (inicio && fim) {
      filtros.data = {
        $gte: new Date(inicio),
        $lte: new Date(fim)
      };
    }

    const viagens = await Viagem.find(filtros).populate('usuario'); 
    res.status(200).json(viagens);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar viagens', detalhes: err });
  }
};