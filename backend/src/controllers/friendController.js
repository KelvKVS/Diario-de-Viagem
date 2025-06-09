const User = require('../models/user');

exports.sendFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  if (userId === friendId) {
    return res.status(400).json({ error: 'Você não pode adicionar a si mesmo' });
  }

  const user = await User.findById(friendId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (user.friendRequests.includes(userId)) {
    return res.status(400).json({ error: 'Convite já enviado' });
  }

  user.friendRequests.push(userId);
  await user.save();

  res.status(200).json({ message: 'Solicitação de amizade enviada' });
};

exports.acceptFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (!user.friendRequests.includes(friendId)) {
    return res.status(400).json({ error: 'Solicitação não encontrada' });
  }

  user.friends.push(friendId);
  friend.friends.push(userId);

  user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
  await user.save();
  await friend.save();

  res.status(200).json({ message: 'Amizade aceita' });
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'username email');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar amigos' });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friendRequests', 'username email');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar solicitações pendentes' });
  }
};