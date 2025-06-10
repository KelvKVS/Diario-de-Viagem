import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Friends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await api.get('/api/auth/verify-token');
        if (response.data.valid) {
          setUserId(response.data.user._id);
        } else {
          localStorage.clear();
          navigate('/');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.clear();
        navigate('/');
      }
    };

    verifyAuth();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const response = await api.get(`/api/users/friends/${userId}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get(`/api/users/requests/${userId}`);
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.post('/api/users/accept-request', {
        userId,
        friendId: requestId
      });
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.post('/api/users/reject-request', {
        userId,
        friendId: requestId
      });
      fetchFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleSendRequest = async (targetUserId) => {
    try {
      console.log('Sending friend request to:', targetUserId);
      const response = await api.post('/api/users/send-request', {
        friendId: targetUserId
      });
      console.log('Friend request sent successfully:', response.data);
      // Atualiza a lista de resultados da busca
      setSearchResults(prevResults => 
        prevResults.filter(user => user._id !== targetUserId)
      );
    } catch (error) {
      console.error('Error sending friend request:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Erro ao enviar solicitação de amizade');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await api.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (!userId || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'friends'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('friends')}
        >
          Meus Amigos
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'requests'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          Solicitações
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'add'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Adicionar Amigos
        </button>
      </div>

      {activeTab === 'friends' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
            >
              <img
                src={friend.avatar || 'https://via.placeholder.com/50'}
                alt={friend.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{friend.name}</h3>
                <p className="text-gray-600 text-sm">{friend.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'requests' ? (
        <div className="space-y-4">
          {friendRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={request.avatar || 'https://via.placeholder.com/50'}
                  alt={request.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{request.name}</h3>
                  <p className="text-gray-600 text-sm">{request.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Aceitar
                </button>
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Buscar
            </button>
          </form>

          {searchLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar || 'https://via.placeholder.com/50'}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends; 