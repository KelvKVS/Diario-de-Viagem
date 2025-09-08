import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import NewPostModal from './NewPostModal';
import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import Toast from './Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function TripFeed({ tripId, isMember }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchPosts();
  }, [tripId]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/posts/trip/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar posts');
      }

      const data = await response.json();
      
      const postsArray = Array.isArray(data) ? data : data.posts || [];
      
      const sortedPosts = postsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    if (!newPost.author || !newPost.author.name) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      newPost.author = {
        _id: userData._id,
        name: userData.name,
        profilePhoto: userData.profilePhoto
      };
    }
    
    setPosts(prev => [newPost, ...prev]);
    showToast('Post criado com sucesso!');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Posts da Viagem</h2>
        {isMember && (
          <button
            onClick={() => setShowNewPostModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Post</span>
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {isMember 
            ? 'Nenhum post encontrado. Seja o primeiro a compartilhar algo sobre esta viagem!'
            : 'Nenhum post encontrado nesta viagem.'}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            return <PostCard key={post._id} post={post} />;
          })}
        </div>
      )}

      <NewPostModal
        show={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        tripId={tripId}
        onPostCreated={handlePostCreated}
      />

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

TripFeed.propTypes = {
  tripId: PropTypes.string.isRequired,
  isMember: PropTypes.bool.isRequired
};

export default TripFeed; 