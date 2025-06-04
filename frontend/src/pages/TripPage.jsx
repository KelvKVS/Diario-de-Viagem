import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TripFeed from '../components/TripFeed';
import { Calendar, Users, MapPin, Globe, Lock, Edit, Share2, MoreVertical, ChevronLeft } from 'lucide-react';
import Modal from '../components/Modal';

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
      
      // Check if current user is an admin
      const userData = JSON.parse(localStorage.getItem('userData'));
      setIsAdmin(data.admins?.some(admin => admin._id === userData._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/trip/${tripId}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareModal(false);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
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
      {/* Header Section */}
      <div className="relative">
        {/* Back Button - Fixed Position */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200 bg-black/20 hover:bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>

        {/* Cover Image Section */}
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
                    {isAdmin && (
                      <button
                        onClick={() => navigate(`/trip/${tripId}/edit`)}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
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
                                onClick={() => navigate(`/trip/${tripId}/members`)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Gerenciar Membros
                              </button>
                              <button
                                onClick={() => navigate(`/trip/${tripId}/settings`)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Configurações
                              </button>
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

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trip Info Cards */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Trip Feed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <TripFeed tripId={tripId} />
        </div>
      </div>

      {/* Share Modal */}
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
    </div>
  );
}

export default TripPage; 