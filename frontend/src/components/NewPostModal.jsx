import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { Image, MapPin } from 'lucide-react';
import apiService from '../services/api';

function NewPostModal({ show, onClose, tripId, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('location', location);
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await apiService.post(`/api/posts/${tripId}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onPostCreated(response.post);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message || 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Você pode selecionar no máximo 5 imagens');
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        setError('Por favor, selecione apenas arquivos de imagem');
      }
      return isValid;
    });

    if (validFiles.length !== files.length) {
      return;
    }

    setImages(validFiles);
    setError(null);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setLocation('');
    setImages([]);
    setError(null);
  };

  return (
    <Modal show={show} onClose={onClose} title="Novo Post">
      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              maxLength={100}
              placeholder="Dê um título ao seu post"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              maxLength={1000}
              placeholder="Compartilhe sua experiência..."
            />
            <p className="text-sm text-gray-500 text-right mt-1">
              {content.length}/1000 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Onde você está?"
                maxLength={100}
              />
              <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Imagens
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <Image className="w-5 h-5" />
                <span>Selecionar Imagens</span>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {images.length > 0 && (
                <span className="text-sm text-gray-500">
                  {images.length} imagem(ns) selecionada(s)
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Máximo de 5 imagens. Formatos aceitos: JPG, PNG, GIF
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Criando...' : 'Criar Post'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

NewPostModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tripId: PropTypes.string.isRequired,
  onPostCreated: PropTypes.func.isRequired
};

export default NewPostModal; 