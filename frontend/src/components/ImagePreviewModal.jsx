import React from 'react';

const ImagePreviewModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  onConfirm, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Preview da Foto</h3>
        <div className="relative aspect-square w-full mb-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Enviando...' : 'Confirmar e Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal; 