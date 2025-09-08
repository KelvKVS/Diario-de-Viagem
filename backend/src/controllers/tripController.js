const TripService = require('../services/tripService');
const { AppError } = require('../middleware/errorHandler');
const path = require('path');
const fs = require('fs').promises;

exports.createTrip = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const trip = await TripService.createTrip(
      req.user._id,
      req.body,
      req.file
    );

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.getTripById = async (req, res, next) => {
  try {
    const trip = await TripService.getTripById(req.params.id, req.userId);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.getUserTrips = async (req, res, next) => {
  try {
    const trips = await TripService.getUserTrips(req.userId);
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

exports.getTrips = async (req, res, next) => {
  try {
    const result = await TripService.getTrips(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const updatedTrip = await TripService.updateTrip(
      req.params.id,
      req.user._id,
      req.body,
      req.file
    );
    res.status(200).json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    await TripService.deleteTrip(req.params.id, req.user._id);
    res.status(200).json({ message: 'Viagem excluída com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const trip = await TripService.addMember(
      req.params.id,
      req.user._id,
      req.body.userId
    );
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const trip = await TripService.removeMember(
      req.params.id,
      req.user._id,
      req.params.memberId
    );
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};
