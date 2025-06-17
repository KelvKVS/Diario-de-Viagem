const User = require('../models/user');
const { AppError } = require('../middleware/errorHandler');

class FriendService {
  static async searchFriends(userId, query) {
    if (!query || query.trim().length < 2) {
      throw new AppError('A busca deve ter pelo menos 2 caracteres', 400);
    }

    const currentUser = await User.findById(userId).populate('friends');
    if (!currentUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const searchRegex = new RegExp(query, 'i');
    return currentUser.friends.filter(friend => 
      friend.name.match(searchRegex) || friend.email.match(searchRegex)
    );
  }

  static async sendFriendRequest(userId, friendId) {
    if (!friendId) {
      throw new AppError('ID do amigo é obrigatório', 400);
    }

    if (userId === friendId) {
      throw new AppError('Você não pode adicionar a si mesmo', 400);
    }

    const user = await User.findById(friendId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (user.friendRequests.includes(userId)) {
      throw new AppError('Convite já enviado', 400);
    }

    user.friendRequests.push(userId);
    await user.save();

    return { message: 'Solicitação de amizade enviada' };
  }

  static async acceptFriendRequest(userId, friendId) {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (!user.friendRequests.includes(friendId)) {
      throw new AppError('Solicitação não encontrada', 400);
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    await user.save();
    await friend.save();

    return { message: 'Amizade aceita' };
  }

  static async getFriends(userId) {
    const user = await User.findById(userId).populate('friends', 'name email profilePhoto');
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user.friends;
  }

  static async getPendingRequests(userId) {
    const user = await User.findById(userId).populate('friendRequests', 'name email profilePhoto');
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user.friendRequests;
  }

  static async searchUsers(userId, query) {
    if (!query || query.trim().length < 2) {
      throw new AppError('A busca deve ter pelo menos 2 caracteres', 400);
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const searchRegex = new RegExp(query, 'i');
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ],
      _id: { $ne: userId }
    }).select('name email profilePhoto');

    return users.filter(user => 
      !currentUser.friends.includes(user._id) && 
      !currentUser.friendRequests.includes(user._id)
    );
  }

  static async rejectFriendRequest(userId, friendId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (!user.friendRequests.includes(friendId)) {
      throw new AppError('Solicitação não encontrada', 400);
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    await user.save();

    return { message: 'Solicitação rejeitada' };
  }
}

module.exports = FriendService; 