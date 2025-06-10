import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, MessageCircle, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PostCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <img
            src={post.author.avatar ? `${API_URL}/uploads/${post.author.avatar}` : '/default-avatar.png'}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{post.author.name}</h3>
                {post.trip && (
                  <Link 
                    to={`/trip/${post.trip._id}`}
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{post.trip.name}</span>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words mb-4">{post.content}</p>
        
        {post.location && (
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{post.location}</span>
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={`${API_URL}/uploads/${image}`}
                  alt={`Post image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 hover:text-teal-500 transition-colors cursor-pointer">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }).isRequired,
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    location: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.array,
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

export default PostCard; 