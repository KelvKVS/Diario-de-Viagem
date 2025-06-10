import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Users, 
  UserPlus, 
  Bell, 
  Image as ImageIcon,
  Pencil,
  MapPin,
  Mail,
  UserCircle,
  Check,
  X,
  Search,
  Plus,
  Camera
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import PostCard from '../components/PostCard';
import FormField from '../components/FormField';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

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
          setUserData(response.data.user);
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
      fetchUserPosts();
    }
  }, [userId]);

  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        location: userData.location || ''
      });
    }
  }, [userData]);

  const fetchFriends = async () => {
    try {
      const response = await api.get(`/api/users/friends/${userId}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      showToast('Erro ao carregar amigos', 'error');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get(`/api/users/requests/${userId}`);
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      showToast('Erro ao carregar solicitações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await api.get(`/api/posts/user/${userId}`);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      showToast('Erro ao carregar posts', 'error');
    } finally {
      setPostsLoading(false);
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
      showToast('Solicitação aceita com sucesso!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      showToast('Erro ao aceitar solicitação', 'error');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.post('/api/users/reject-request', {
        userId,
        friendId: requestId
      });
      fetchFriendRequests();
      showToast('Solicitação rejeitada');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      showToast('Erro ao rejeitar solicitação', 'error');
    }
  };

  const handleSendRequest = async (targetUserId) => {
    try {
      await api.post('/api/users/send-request', {
        friendId: targetUserId
      });
      setSearchResults(prevResults => 
        prevResults.filter(user => user._id !== targetUserId)
      );
      showToast('Solicitação enviada com sucesso!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      showToast(error.response?.data?.error || 'Erro ao enviar solicitação', 'error');
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
      showToast('Erro ao buscar usuários', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/users/profile', editForm);
      setUserData(response.data);
      setIsEditing(false);
      showToast('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.response?.data?.message || 'Erro ao atualizar perfil', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo e tamanho do arquivo
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione uma imagem válida', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      showToast('A imagem deve ter no máximo 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await api.post('/api/users/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.user) {
        setUserData(prev => ({
          ...prev,
          ...response.data.user
        }));
      }
      setProfilePhoto(null);
      setPreviewUrl(null);
      setShowPreviewModal(false);
      showToast('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast(error.response?.data?.message || 'Erro ao fazer upload da foto', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return '/default-avatar.png';
    if (photoPath.startsWith('http')) return photoPath;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}${photoPath}`;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
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
      {/* Profile Header with Cover Photo */}
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
        <div className="absolute -bottom-16 left-8">
          <div className="relative group">
            <div className="relative w-32 h-32">
              <img
                src={getProfilePhotoUrl(userData?.profilePhoto)}
                alt={userData?.name}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="absolute inset-0 group-hover:bg-black/40 rounded-full transition-all duration-200 flex items-center justify-center">
                <label 
                  htmlFor="photo-upload" 
                  className="opacity-0 group-hover:opacity-100 cursor-pointer p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-opacity duration-200"
                >
                  <Camera className="h-6 w-6" />
                </label>
              </div>
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData?.name}</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userData?.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Editar perfil"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Bio
                </h3>
                <p className="mt-1 text-gray-700">{userData?.bio || 'Nenhuma bio adicionada'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Localização
                </h3>
                <p className="mt-1 text-gray-700">{userData?.location || 'Não especificada'}</p>
              </div>
            </div>
          </div>

          {/* Friends Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Amigos
              </h2>
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
            <div className="space-y-3">
              {friends.slice(0, 5).map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getProfilePhotoUrl(friend.profilePhoto)}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-sm">{friend.name}</h3>
                      <p className="text-gray-500 text-xs">{friend.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${friend._id}`)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {friends.length > 5 && (
                <button
                  onClick={() => setActiveTab('friends')}
                  className="w-full text-center text-blue-500 hover:text-blue-600 text-sm py-2"
                >
                  Ver todos os {friends.length} amigos
                </button>
              )}
            </div>
          </div>

          {/* Friend Requests Section */}
          {friendRequests.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Solicitações de Amizade
              </h2>
              <div className="space-y-3">
                {friendRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getProfilePhotoUrl(request.profilePhoto)}
                        alt={request.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-sm">{request.name}</h3>
                        <p className="text-gray-500 text-xs">{request.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="p-1 text-green-500 hover:text-green-600"
                        title="Aceitar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="p-1 text-red-500 hover:text-red-600"
                        title="Recusar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Posts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Meus Posts
            </h2>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Você ainda não tem posts publicados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        show={isEditing}
        onClose={() => setIsEditing(false)}
        title="Editar Perfil"
      >
        <div className="p-4">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome"
                name="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                required
                icon={<User className="w-5 h-5 text-gray-400" />}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                required
                icon={<Mail className="w-5 h-5 text-gray-400" />}
              />
            </div>
            <FormField
              label="Bio"
              name="bio"
              type="textarea"
              value={editForm.bio}
              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
              rows="3"
              icon={<UserCircle className="w-5 h-5 text-gray-400" />}
            />
            <FormField
              label="Localização"
              name="location"
              value={editForm.location}
              onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        show={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setProfilePhoto(null);
          setPreviewUrl(null);
        }}
        title="Preview da Foto"
      >
        <div className="p-4">
          <div className="relative aspect-square w-full mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowPreviewModal(false);
                setProfilePhoto(null);
                setPreviewUrl(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setShowPreviewModal(false);
                setProfilePhoto(null);
                setPreviewUrl(null);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Confirmar e Enviar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configurações da Conta"
      >
        <div className="p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Preferências de Notificação</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Notificações de Amizade</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notificações de Comentários</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        show={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        title="Adicionar Amigos"
      >
        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <FormField
              label="Buscar por nome ou email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome ou email..."
              icon={<Search className="w-5 h-5 text-gray-400" />}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Buscar</span>
            </button>
          </form>

          {searchLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={getProfilePhotoUrl(user.profilePhoto)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
              ))}
              {searchResults.length === 0 && searchQuery && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum usuário encontrado
                </p>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Photo Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Enviando Foto</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {uploadProgress}% concluído
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default Profile; 