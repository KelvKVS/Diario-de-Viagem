const Trip = require('../models/trip');
const Post = require('../models/post');
const path = require('path');
const fs = require('fs').promises;
const { AppError } = require('../middleware/errorHandler');

class TripService {
  static async validateAdminAccess(tripId, userId) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    if (!trip.admins.includes(userId)) {
      throw new AppError('Acesso não autorizado', 403);
    }

    return trip;
  }

  static async validateMemberAccess(tripId, userId) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    if (!trip.isPublic && !trip.members.includes(userId)) {
      throw new AppError('Acesso não autorizado', 403);
    }

    return trip;
  }

  static async createTrip(userId, tripData, file) {
    let coverImage = '';
    if (file) {
      coverImage = `/uploads/trips/${file.filename}`;
    }

    const trip = new Trip({
      ...tripData,
      coverImage,
      members: [userId],
      admins: [userId],
      createdBy: userId
    });

    await trip.save();
    await trip.populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    return trip;
  }

  static async getTripById(tripId, userId) {
    const trip = await Trip.findById(tripId)
      .populate('members', 'name email profilePhoto')
      .populate('admins', 'name email profilePhoto')
      .populate('createdBy', 'name email profilePhoto');

    if (!trip) {
      throw new AppError('Viagem não encontrada', 404);
    }

    if (!trip.isPublic) {
      if (!userId) {
        throw new AppError('Acesso não autorizado', 403);
      }
      
      const isMember = trip.members.some(member => member._id.toString() === userId.toString());
      if (!isMember) {
        throw new AppError('Acesso não autorizado', 403);
      }
    }

    return trip;
  }

  static async getUserTrips(userId) {
    return Trip.find({ members: userId })
      .populate('members', 'name email profilePhoto')
      .populate('admins', 'name email profilePhoto')
      .populate('createdBy', 'name email profilePhoto');
  }

  static async getTrips(query) {
    const {
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isPublic = true,
      search = '',
      memberId = null
    } = query;

    const queryObj = {};
    if (isPublic === 'true') {
      queryObj.isPublic = true;
    }

    if (memberId) {
      queryObj.members = memberId;
    }

    if (search) {
      queryObj.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [trips, total] = await Promise.all([
      Trip.find(queryObj)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('members', 'name email profilePhoto')
        .populate('admins', 'name email profilePhoto')
        .populate('createdBy', 'name email profilePhoto'),
      Trip.countDocuments(queryObj)
    ]);

    return {
      trips,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };
  }

  static async updateTrip(tripId, userId, updateData, file) {
    const trip = await this.validateAdminAccess(tripId, userId);

    if (file) {
      updateData.coverImage = `/uploads/trips/${file.filename}`;
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    return updatedTrip;
  }

  static async deleteTrip(tripId, userId) {
    const trip = await this.validateAdminAccess(tripId, userId);

    // Deletar todos os posts da viagem e suas imagens
    const posts = await Post.find({ trip: tripId });
    for (const post of posts) {
      if (post.images && post.images.length > 0) {
        await Promise.all(post.images.map(image => 
          fs.unlink(path.join('uploads', image)).catch(() => {})
        ));
      }
      await post.deleteOne();
    }

    await trip.deleteOne();
  }

  static async addMember(tripId, userId, newMemberId) {
    const trip = await this.validateAdminAccess(tripId, userId);

    if (!trip.members.includes(newMemberId)) {
      trip.members.push(newMemberId);
      await trip.save();
    }

    await trip.populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    return trip;
  }

  static async removeMember(tripId, userId, memberId) {
    const trip = await this.validateAdminAccess(tripId, userId);

    trip.members = trip.members.filter(member => member.toString() !== memberId);
    
    if (trip.admins.includes(memberId)) {
      trip.admins = trip.admins.filter(admin => admin.toString() !== memberId);
    }

    await trip.save();
    await trip.populate([
      { path: 'members', select: 'name email profilePhoto' },
      { path: 'admins', select: 'name email profilePhoto' },
      { path: 'createdBy', select: 'name email profilePhoto' }
    ]);

    return trip;
  }
}

module.exports = TripService; 