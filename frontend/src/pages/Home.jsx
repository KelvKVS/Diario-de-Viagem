import { useState, useEffect } from "react";
import {
  MapPin,
  Map,
  Navigation,
  Compass,
  Send,
  Globe as GlobeIcon,
  Plus,
  Calendar,
} from "lucide-react";
import PostCard from "../components/PostCard";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showBanner, setShowBanner] = useState(() => {
    const lastClosed = localStorage.getItem('bannerLastClosed');
    if (!lastClosed) return true;
    const last = new Date(lastClosed);
    const now = new Date();
    return (now - last) > 24 * 60 * 60 * 1000;
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      fetchPosts();
      fetchUserTrips();
    }
  }, [userData]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/api/posts/user/${userData._id}`);
      setPosts(response);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTrips = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await apiService.get('/api/trips', {
        params: {
          isPublic: 'false',
          memberId: userData._id
        }
      });
      setUserTrips(response.trips);
    } catch (err) {
      console.error('Error fetching user trips:', err);
    }
  };

  const handleNewTrip = () => {
    navigate('/new-trip');
  };

  const handleTripClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      {showBanner && (
        <div className="min-h-[50vh] bg-gradient-to-br from-sky-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-8 md:py-12 relative overflow-hidden">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-amber-400/20 blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-emerald-400/20 blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-10 blur-3xl"></div>

          <button
            onClick={() => {
              setShowBanner(false);
              localStorage.setItem('bannerLastClosed', new Date().toISOString());
            }}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1 shadow transition"
            aria-label="Fechar banner"
          >
            Fechar
          </button>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 md:px-6 py-1.5 rounded-full mb-4 md:mb-6">
              <GlobeIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="font-medium text-sm md:text-base">Explore o mundo conosco</span>
            </div>

            <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                Conectando viajantes,
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                inspirando jornadas
              </span>
            </h1>

            <p className="text-base md:text-xl text-gray-700 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                No TravelConnect, cada viagem é uma história compartilhada.
              </span>
              <br className="hidden md:block" />
              <span className="hidden md:inline"> </span>
              Descubra destinos autênticos através dos olhos de outros
              exploradores e inspire-se para criar suas próprias aventuras
              inesquecíveis.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-8 md:mb-12">
              <button 
                onClick={() => navigate('/explorer')}
                className="w-full sm:w-auto flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
              >
                <Compass className="w-4 h-4 md:w-5 md:h-5 mr-2 transition-transform group-hover:rotate-12" />
                <span>Começe a explorar</span>
              </button>

              <button 
                onClick={handleNewTrip}
                className="w-full sm:w-auto flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 bg-white text-gray-800 font-medium rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span>Compartilhe sua viagem</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Posts Section */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Últimas Postagens</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum post encontrado. Comece compartilhando suas viagens!image.png
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Trips Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Minhas Viagens</h3>
              <div className="space-y-3 md:space-y-4">
                {userTrips.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Você ainda não tem viagens. Crie uma nova viagem!
                  </div>
                ) : (
                  userTrips.map((trip) => (
                    <div 
                      key={trip._id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleTripClick(trip._id)}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{trip.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>
                        {trip.location && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{trip.location}</span>
                          </div>
                        )}
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0">
                        <Navigation className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;