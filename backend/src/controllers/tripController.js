const Trip = require('../models/trip');

exports.createTrip = async (req, res) => {
  try {
    const { name, isPublic, members } = req.body;

    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Nome e pelo menos um membro são obrigatórios' });
    }

    const trip = await Trip.create({
      name,
      isPublic: isPublic ?? true,
      members,
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar trip', details: err.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate('members', 'name email');
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar trips', details: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: 'Trip não encontrada' });

    if (!trip.members.includes(userId)) {
      trip.members.push(userId);
      await trip.save();
    }

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar membro', details: err.message });
  }
};