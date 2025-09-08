const User = require('../models/user');
const FriendService = require('../services/friendService');

exports.searchFriends = async (req, res, next) => {
  try {
    const friends = await FriendService.searchFriends(req.userId, req.query.q);
    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

exports.sendFriendRequest = async (req, res, next) => {
  try {
    const result = await FriendService.sendFriendRequest(req.userId, req.body.friendId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const result = await FriendService.acceptFriendRequest(req.body.userId, req.body.friendId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    const friends = await FriendService.getFriends(req.params.userId);
    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

exports.getPendingRequests = async (req, res, next) => {
  try {
    const requests = await FriendService.getPendingRequests(req.params.userId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const users = await FriendService.searchUsers(req.userId, req.query.q);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.rejectFriendRequest = async (req, res, next) => {
  try {
    const result = await FriendService.rejectFriendRequest(req.body.userId, req.body.friendId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};