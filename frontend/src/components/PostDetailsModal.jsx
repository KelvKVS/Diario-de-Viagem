import React, { useState, useEffect, useRef } from 'react';
import { MapPin, MessageSquare, Heart, Share, Bookmark, Clock, Send, Trash2, ChevronUp, ChevronDown, Star, X } from 'lucide-react';
import apiService from '../services/api';

const PostDetailsModal = ({ postId, open = true, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortComments, setSortComments] = useState('newest');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setCurrentUserId(userData._id);
    }
    fetchPost();
    fetchComments();
    // ESC to close
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
    // eslint-disable-next-line
  }, [postId, open]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/api/posts/${postId}`);
      setPost(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar a postagem');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await apiService.get(`/api/comments/post/${postId}`);
      setComments(response);
    } catch (err) {
      // Silenciar erro de comentários
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await apiService.post(`/api/comments/post/${postId}`, {
        content: newComment
      });
      setComments([response, ...comments]);
      setNewComment('');
    } catch (err) {
      // Silenciar erro
    }
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await apiService.delete(`/api/comments/post/${postId}/comment/${commentToDelete}`);
      setComments(comments.filter(comment => comment._id !== commentToDelete));
    } catch (err) {
      // Silenciar erro
    } finally {
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

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

  const getSortedComments = () => {
    const sorted = [...comments];
    switch (sortComments) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'top':
        return sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Close modal on background click
  const handleOverlayClick = (e) => {
    if (modalRef.current && e.target === modalRef.current && onClose) {
      onClose();
    }
  };

  if (!open) return null;

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
  if (!post) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <div className="text-gray-600 text-xl mb-4">Postagem não encontrada</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 w-full h-full flex items-center justify-center backdrop-blur-xs bg-gray-900/30 overflow-y-auto p-0 sm:p-8"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-3xl mx-auto bg-white rounded-none sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn min-h-screen sm:min-h-0 flex flex-col"
        style={{ maxHeight: '100vh' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-3 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>
        {/* Post Content */}
        <div className="flex-1 max-h-full overflow-y-auto pb-32 sm:pb-0">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={post.author.profilePhoto ? `${apiService.baseURL}${post.author.profilePhoto}` : '/default-avatar.png'}
                    alt={post.author.name}
                    className={`w-14 h-14 rounded-full object-cover border-4 ${post.author.role === 'Administrador' ? 'border-blue-500' : 'border-gray-200'} shadow-md`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  {post.author.role === 'Administrador' && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{post.author.name}</h3>
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
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-700 whitespace-pre-wrap break-words mb-8 text-lg leading-relaxed font-sans">
              {post.content}
            </p>
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {post.images.map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 group">
                    <img
                      src={`${apiService.baseURL}/uploads/${image}`}
                      alt={`Post image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
              <div className="flex items-center space-x-8">
                <button className="flex items-center space-x-2 hover:text-red-500 transition-colors group relative" title="Curtir">
                  <Heart className="w-6 h-6" />
                  <span className="font-medium">{post.likes?.length || 0}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity">Curtir</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group relative" title="Comentar">
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-medium">{comments.length}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity">Comentar</span>
                </button>
                <button className="hover:text-green-500 transition-colors group relative" title="Compartilhar">
                  <Share className="w-6 h-6" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity">Compartilhar</span>
                </button>
              </div>
              <button className="hover:text-yellow-500 transition-colors group relative" title="Salvar">
                <Bookmark className="w-6 h-6" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity">Salvar</span>
              </button>
            </div>
          </div>
          {/* Comments Section */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Comentários</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Ordenar por:</span>
                <select
                  value={sortComments}
                  onChange={(e) => setSortComments(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="top">Mais curtidos</option>
                </select>
              </div>
            </div>
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 shadow-sm transition-shadow focus:shadow-lg"
                />
                <button
                  type="submit"
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            {/* Comments List */}
            <div className="space-y-6">
              {getSortedComments().map((comment, idx) => (
                <React.Fragment key={comment._id}>
                  {idx > 0 && <div className="border-b border-gray-100 my-2"></div>}
                  <div className="flex space-x-4">
                    <div className="flex flex-col items-center space-y-1">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-500">0</span>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-xl p-4 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <img
                              src={comment.author.profilePhoto ? `${apiService.baseURL}${comment.author.profilePhoto}` : '/default-avatar.png'}
                              alt={comment.author.name}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                            <span className="font-semibold text-gray-900">{comment.author.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 break-words whitespace-pre-line">{comment.content}</p>
                      </div>
                      {currentUserId && comment.author._id === currentUserId && (
                        <div className="flex items-center space-x-2 mt-2 ml-2">
                          <button
                            onClick={() => handleDeleteClick(comment._id)}
                            className="text-red-500 hover:text-red-600 text-sm flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirmar exclusão</h3>
              <p className="mb-6 text-gray-700">Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteComment}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailsModal; 