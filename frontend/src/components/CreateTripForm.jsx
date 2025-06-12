import React, { useState } from 'react';
import { Globe, Lock, Upload, X } from 'lucide-react';

const CreateTripForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPublic: true,
        coverImage: null
    });

    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitData = new FormData();
        
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('isPublic', formData.isPublic);
        
        if (formData.coverImage) {
            console.log('Appending cover image to FormData:', formData.coverImage);
            submitData.append('coverImage', formData.coverImage);
        }

        // Debug: Log FormData contents
        for (let pair of submitData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        onSubmit(submitData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log('Image file selected:', file);
        if (file) {
            if (!file.type.startsWith('image/')) {
                console.log('Selected file is not an image:', file.type);
                alert('Por favor, selecione apenas arquivos de imagem.');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                console.log('Image file size exceeds limit:', file.size);
                alert('A imagem deve ter no máximo 5MB.');
                return;
            }

            console.log('Valid image file:', file);
            setFormData(prev => ({
                ...prev,
                coverImage: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            coverImage: null
        }));
        setPreviewUrl('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Viagem
                </label>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Viagem para o Nordeste"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Imagem de Capa</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                {previewUrl && (
                    <div className="mt-2 relative w-full h-48">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-md"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Viagem Pública
                </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Criando...' : 'Criar Viagem'}
                </button>
            </div>
        </form>
    );
};

export default CreateTripForm; 