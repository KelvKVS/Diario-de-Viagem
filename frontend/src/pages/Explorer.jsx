import React, { useState, useEffect } from 'react';
import TripCard from '../components/TripCard';
import Modal from '../components/Modal';
import CreateTripForm from '../components/CreateTripForm';
import { Search, Filter, AlertCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
        fetchTrips();
    }, [currentPage, searchTerm]);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token from localStorage:', token); // Debug log

            if (!token) {
                console.log('No token found in localStorage'); // Debug log
                setUser(null);
                return;
            }

            const response = await fetch(`${API_URL}/api/auth/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Auth verify response status:', response.status); // Debug log

            if (response.ok) {
                const data = await response.json();
                console.log('Auth verify response data:', data); // Debug log
                setUser(data.user);
            } else {
                console.log('Auth verify failed, removing token'); // Debug log
                localStorage.removeItem('authToken');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        }
    };

    const fetchTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                isPublic: filters.isPublic
            });

            if (searchTerm) {
                queryParams.append('search', searchTerm);
            }

            const response = await fetch(`${API_URL}/api/trips?${queryParams}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar viagens');
            }

            const data = await response.json();
            console.log('Fetched trips data:', data); // Debug log

            setTrips(data.trips);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrip = async (formData) => {
        try {
            setCreateError(null);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Você precisa estar logado para criar uma viagem');
            }

            console.log('Token:', token); // Debug log
            console.log('FormData:', Object.fromEntries(formData)); // Debug log

            const response = await fetch(`${API_URL}/api/trips`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData); // Debug log
                throw new Error(errorData.error || 'Erro ao criar viagem');
            }

            const data = await response.json();
            console.log('Success response:', data); // Debug log

            setShowCreateModal(false);
            fetchTrips();
        } catch (err) {
            console.error('Create trip error:', err); // Debug log
            setCreateError(err.message);
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Explore Viagens
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubra viagens incríveis compartilhadas pela nossa comunidade
                        e inspire-se para sua próxima aventura.
                    </p>
                </div>

                {/* Barra de pesquisa, filtros e botão de criar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
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
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleFilterChange({ isPublic: !filters.isPublic })}
                            className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                                filters.isPublic 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            <span>{filters.isPublic ? 'Públicas' : 'Todas'}</span>
                        </button>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="createdAt">Mais recentes</option>
                            <option value="name">Nome</option>
                            <option value="startDate">Data de início</option>
                        </select>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            <span>Criar Viagem</span>
                        </button>
                    </div>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Grid de viagens */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando viagens...</p>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Nenhuma viagem encontrada.</p>
                        {searchTerm && (
                            <p className="text-sm text-gray-500 mt-2">
                                Tente ajustar sua busca ou filtros.
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <TripCard key={trip._id} trip={trip} />
                            ))}
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 rounded-lg border ${
                                            currentPage === index + 1
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Criação de Viagem */}
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