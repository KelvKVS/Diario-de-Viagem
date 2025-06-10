const User = require('../models/user');

exports.sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    console.log('Send friend request:', { userId, friendId, body: req.body });

    if (!friendId) {
      return res.status(400).json({ error: 'ID do amigo é obrigatório' });
    }

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
  } catch (error) {
    console.error('Error in sendFriendRequest:', error);
    res.status(500).json({ error: 'Erro ao enviar solicitação de amizade' });
  }
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

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.userId; // Vem do middleware de autenticação

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'A busca deve ter pelo menos 2 caracteres' });
    }

    // Busca o usuário atual primeiro
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Busca usuários que correspondam à query
    const searchRegex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ],
      _id: { $ne: currentUserId } // Exclui o usuário atual
    }).select('name email'); // Seleciona apenas campos necessários

    // Filtra os resultados para excluir amigos e solicitações pendentes
    const filteredUsers = users.filter(user => 
      !currentUser.friends.includes(user._id) && 
      !currentUser.friendRequests.includes(user._id)
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Erro na busca de usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (!user.friendRequests.includes(friendId)) {
    return res.status(400).json({ error: 'Solicitação não encontrada' });
  }

  user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
  await user.save();

  res.status(200).json({ message: 'Solicitação rejeitada' });
};