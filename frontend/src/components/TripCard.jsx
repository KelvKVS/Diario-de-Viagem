import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users, Calendar, Globe, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TripCard = ({ trip }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-trip.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_URL}/${cleanPath}`;
  };

  // Debug log
  console.log('Trip data:', trip);
  console.log('Image URL:', getImageUrl(trip.coverImage));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={getImageUrl(trip.coverImage)}
          alt={trip.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', e);
            e.target.src = '/placeholder-trip.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          {trip.isPublic ? (
            <Globe className="w-6 h-6 text-blue-500" />
          ) : (
            <Lock className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{trip.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{trip.members?.length || 0} membros</span>
        </div>
      </div>
    </div>
  );
};

TripCard.propTypes = {
  trip: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    isPublic: PropTypes.bool,
    members: PropTypes.array,
    admins: PropTypes.array,
    createdBy: PropTypes.object
  }).isRequired
};

export default TripCard;
