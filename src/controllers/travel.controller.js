const Travel = require('../models/travel.model');
const formatDate = require('../utils/formatDate');

const createTravel = async (req, res) => {
  try {
    const { title, description, location, date, visibility, image } = req.body;

    if (!title || !description || !location || !date) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }

    const newTravel = new Travel({
      title,
      description,
      location,
      date: formatDate(date),
      visibility,
      image,
      user: req.userId, // supondo que você usa middleware de auth
    });

    const saved = await newTravel.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = {
  createTravel,
  // outras funções (getAllTravels, getUserTravels, etc)
};

const getPublicTravels = async (req, res) => {
  try {
    const travels = await Travel.find({ visibility: 'public' }).sort({ date: -1 });
    res.status(200).json(travels);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar viagens públicas.' });
  }
};

const getUserTravels = async (req, res) => {
  try {
    const travels = await Travel.find({ user: req.userId }).sort({ date: -1 });
    res.status(200).json(travels);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar suas viagens.' });
  }
};