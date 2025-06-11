import React, { useState, useEffect } from 'react';
import TripCard from '../components/TripCard';
import Modal from '../components/Modal';
import CreateTripForm from '../components/CreateTripForm';
import { Search, Filter, AlertCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import apiService from '../services/api';

const ITEMS_PER_PAGE = 9;

function Explorer() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        isPublic: true,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createError, setCreateError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [currentPage, searchTerm, filters]);

    const checkAuth = async () => {
        try {
            const response = await apiService.get('/api/auth/verify-token');
            setUser(response.user);
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            apiService.clearAuth();
        }
    };

    const fetchTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                isPublic: filters.isPublic
            };

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await apiService.get('/api/trips', { params });
            setTrips(response.trips);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError(err.message || 'Erro ao buscar viagens');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrip = async (formData) => {
        try {
            setCreateError(null);
            await apiService.post('/api/trips', formData);
            setShowCreateModal(false);
            fetchTrips();
        } catch (err) {
            console.error('Create trip error:', err);
            setCreateError(err.message || 'Erro ao criar viagem');
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                        Explore Viagens
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Descubra viagens incríveis compartilhadas pela nossa comunidade
                        e inspire-se para sua próxima aventura.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 md:mb-8 space-y-4 md:space-y-0">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar viagens..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => handleFilterChange({ isPublic: !filters.isPublic })}
                            className={`flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-2 rounded-lg border ${
                                filters.isPublic 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            <Filter className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            <span className="text-sm md:text-base">{filters.isPublic ? 'Públicas' : 'Todas'}</span>
                        </button>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                            className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        >
                            <option value="createdAt">Mais recentes</option>
                            <option value="name">Nome</option>
                            <option value="startDate">Data de início</option>
                        </select>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            <span>Criar Viagem</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 md:mb-8 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-sm md:text-base text-red-700">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8 md:py-12">
                        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">Carregando viagens...</p>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                        <p className="text-sm md:text-base text-gray-600">Nenhuma viagem encontrada.</p>
                        {searchTerm && (
                            <p className="text-xs md:text-sm text-gray-500 mt-2">
                                Tente ajustar sua busca ou filtros.
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {trips.map((trip) => (
                                <TripCard 
                                    key={trip._id} 
                                    trip={trip} 
                                    isClickable={trip.isPublic || (user && trip.userId === user._id)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 md:mt-8 flex justify-center items-center gap-1 md:gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-1.5 md:p-2 rounded-lg border ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                
                                <div className="flex gap-1 md:gap-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg border text-sm md:text-base ${
                                                currentPage === index + 1
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-1.5 md:p-2 rounded-lg border ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
 
            <Modal
                show={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setCreateError(null);
                }}
                title="Criar Nova Viagem"
            >
                {createError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {createError}
                    </div>
                )}
                <CreateTripForm
                    onSubmit={handleCreateTrip}
                    onCancel={() => {
                        setShowCreateModal(false);
                        setCreateError(null);
                    }}
                />
            </Modal>
        </div>
    );
}

export default Explorer;