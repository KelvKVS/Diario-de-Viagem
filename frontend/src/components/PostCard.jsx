import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MapPin, MessageSquare, Heart, Share, Bookmark, MoreVertical, Clock } from 'lucide-react';
import apiService from '../services/api';
import PostDetailsModal from './PostDetailsModal';

function PostCard({ post }) {
  const [openModal, setOpenModal] = useState(false);

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
    return `${apiService.baseURL}${imagePath}`;
  };

  const handlePostClick = () => {
    setOpenModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.profilePhoto ? `${apiService.baseURL}${post.author.profilePhoto}` : '/default-avatar.png'}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div>
              <h3 className="font-medium text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.content}</p>

        {post.location && (
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{post.location}</span>
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mb-4">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image)}
                alt={`Imagem ${index + 1} do post`}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-post-image.png';
                }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <Heart className="w-5 h-5 mr-1" />
              <span className="text-sm">0</span>
            </button>
            <button 
              onClick={handlePostClick}
              className="flex items-center text-gray-500 hover:text-blue-500"
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-blue-500">
              <Share className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-blue-500">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <PostDetailsModal
        postId={post._id}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      profilePhoto: PropTypes.string
    }).isRequired,
    comments: PropTypes.array
  }).isRequired
};

export default PostCard; 