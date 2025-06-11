const Trip = require('../models/trip');

exports.createTrip = async (req, res) => {
  try {
    const { name, startDate, endDate, isPublic, description } = req.body;
    
    // Check if user exists in request
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userId = req.user._id;

    // Handle image upload
    let coverImage = '';
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const trip = new Trip({
      name,
      description,
      startDate,
      endDate,
      isPublic: isPublic === 'true',
      coverImage,
      members: [userId],
      admins: [userId],
      createdBy: userId
    });

    await trip.save();

    // Populate the trip with user details
    await trip.populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Erro ao criar viagem' });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('members', 'name email profilePhoto')
      .populate('admins', 'name email profilePhoto')
      .populate('createdBy', 'name email profilePhoto');

    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Convert all IDs to strings for comparison
    const memberIds = trip.members.map(member => member._id.toString());
    const userId = req.userId?.toString();

    // Check if trip is public or user is a member
    if (!trip.isPublic && (!userId || !memberIds.includes(userId))) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error getting trip:', error);
    res.status(500).json({ error: 'Erro ao buscar viagem' });
  }
};

exports.getUserTrips = async (req, res) => {
  try {
    const userId = req.userId; // Obtido do middleware de autenticação
    
    // Busca viagens onde o usuário é membro
    const trips = await Trip.find({ members: userId })
      .populate('members', 'name email photo')
      .populate('admins', 'name email photo');
    
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar viagens do usuário', 
      details: err.message 
    });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isPublic = true,
      search = '',
      memberId = null
    } = req.query;

    // Build query
    const query = {};
    if (isPublic === 'true') {
      query.isPublic = true;
    }

    // Add member filter if provided
    if (memberId) {
      query.members = memberId;
    }

    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute queries
    const [trips, total] = await Promise.all([
      Trip.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('members', 'name email profilePhoto')
        .populate('admins', 'name email profilePhoto')
        .populate('createdBy', 'name email profilePhoto'),
      Trip.countDocuments(query)
    ]);

    res.status(200).json({
      trips,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getting trips:', error);
    res.status(500).json({ error: 'Erro ao buscar viagens' });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Check if user is an admin
    if (!trip.admins.includes(userId)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Handle image upload
    if (req.file) {
      req.body.coverImage = `/uploads/${req.file.filename}`;
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Erro ao atualizar viagem' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Check if user is an admin
    if (!trip.admins.includes(userId)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    await Trip.findByIdAndDelete(id);
    res.status(200).json({ message: 'Viagem excluída com sucesso' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Erro ao excluir viagem' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user._id;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Check if current user is an admin
    if (!trip.admins.includes(currentUserId)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Add member if not already a member
    if (!trip.members.includes(userId)) {
      trip.members.push(userId);
      await trip.save();
    }

    // Populate the updated trip
    await trip.populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Erro ao adicionar membro' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Check if user is an admin
    if (!trip.admins.includes(userId)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Remove member from members array
    trip.members = trip.members.filter(member => member.toString() !== memberId);
    
    // If member was an admin, remove from admins array too
    if (trip.admins.includes(memberId)) {
      trip.admins = trip.admins.filter(admin => admin.toString() !== memberId);
    }

    await trip.save();

    // Populate the updated trip
    await trip.populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Erro ao remover membro' });
  }
};
