import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TripFeed from '../components/TripFeed';
import { Calendar, Users, MapPin, Globe, Lock, Edit, Share2, MoreVertical, ChevronLeft, Settings, UserPlus, Trash2, Save, X, Bell } from 'lucide-react';
import Modal from '../components/Modal';
import AdminPanel from '../components/AdminPanel';
import Toast from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function TripPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/trips/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar detalhes da viagem');
      }

      const data = await response.json();
      setTrip(data);
      
      const userData = JSON.parse(localStorage.getItem('userData'));
      setIsAdmin(data.admins?.some(admin => admin._id === userData._id));
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trip)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar alterações');
      }

      const updatedTrip = await response.json();
      setTrip(updatedTrip);
      setIsAdminPanelOpen(false);
      showToast('Viagem atualizada com sucesso!');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!confirm('Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.')) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir viagem');
      }

      showToast('Viagem excluída com sucesso!');
      navigate('/');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/trip/${tripId}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareModal(false);
    showToast('Link copiado para a área de transferência!');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg m-4">
        {error}
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg m-4">
        Viagem não encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200 bg-black/20 hover:bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="relative h-[50vh] min-h-[400px] bg-gray-900">
          <img
            src={trip.coverImage ? `${API_URL}${trip.coverImage}` : '/default-trip-cover.jpg'}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-white">
                    {trip.isPublic ? (
                      <Globe className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    <span className="text-sm">
                      {trip.isPublic ? 'Viagem Pública' : 'Viagem Privada'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => {
                                  setIsAdminPanelOpen(true);
                                  setActiveTab('edit');
                                  setShowMenu(false);
                                }}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4" />
                                Editar Viagem
                              </button>
                              <button
                                onClick={() => {
                                  setIsAdminPanelOpen(true);
                                  setActiveTab('settings');
                                  setShowMenu(false);
                                }}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Settings className="w-4 h-4" />
                                Configurações
                              </button>
                              <hr className="my-1" />
                            </>
                          )}
                          <button
                            onClick={() => navigate(`/trip/${tripId}/itinerary`)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Ver Roteiro
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">{trip.name}</h1>
                <p className="text-gray-200 text-lg max-w-3xl">{trip.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membros</p>
                    <p className="font-medium">{trip.members?.length || 0} participantes</p>
                  </div>
                </div>

                {trip.location && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Localização</p>
                      <p className="font-medium">{trip.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Membros
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => {/* TODO: Implement member management */}}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {trip.members?.slice(0, 5).map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar ? `${API_URL}${member.avatar}` : '/default-avatar.png'}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-sm">{member.name}</h3>
                        <p className="text-gray-500 text-xs">{member.email}</p>
                      </div>
                    </div>
                    {trip.admins?.some(admin => admin._id === member._id) && (
                      <span className="text-xs text-blue-500">Admin</span>
                    )}
                  </div>
                ))}
                {trip.members?.length > 5 && (
                  <button
                    onClick={() => {/* TODO: Implement view all members */}}
                    className="w-full text-center text-blue-500 hover:text-blue-600 text-sm py-2"
                  >
                    Ver todos os {trip.members.length} membros
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Posts da Viagem
              </h2>
              <TripFeed tripId={tripId} />
            </div>
          </div>
        </div>
      </div>

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        trip={trip}
        onSave={handleSaveTrip}
        onDelete={handleDeleteTrip}
        isSaving={saving}
        isDeleting={deleting}
        error={error}
        onTripChange={(field, value) => {
          setTrip(prev => ({
            ...prev,
            [field]: value
          }));
        }}
      />

      <Modal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Compartilhar Viagem"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Compartilhe o link desta viagem com seus amigos:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${window.location.origin}/trip/${tripId}`}
              readOnly
              className="flex-1 p-2 border border-gray-200 rounded-lg bg-gray-50"
            />
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Copiar
            </button>
          </div>
        </div>
      </Modal>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default TripPage; 