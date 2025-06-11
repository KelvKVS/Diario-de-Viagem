import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, MessageSquare, Heart, Share, Bookmark, MoreVertical, Clock } from 'lucide-react';
import apiService from '../services/api';

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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-post-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiService.baseURL}/uploads/${imagePath}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.profilePhoto ? `${apiService.baseURL}${post.author.profilePhoto}` : '/default-avatar.png'}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                {post.location && (
                  <>
                    <MapPin className="w-4 h-4 mr-1" />
                    {post.location}
                    <span className="mx-2">•</span>
                  </>
                )}
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words mb-4">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(image)}
                  alt={`Post image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-post-image.png';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">{post.likes?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
            <button className="hover:text-green-500 transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>
          <button className="hover:text-yellow-500 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
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
      profilePhoto: PropTypes.string
    }).isRequired,
    location: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.array,
    likes: PropTypes.array,
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

export default PostCard; 