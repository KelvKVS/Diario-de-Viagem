import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function CreateTravel() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    visibility: 'public',
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'SUA_UPLOAD_PRESET'); // <<< Substitua aqui
    data.append('cloud_name', 'SEU_CLOUD_NAME');       // <<< Substitua aqui

    const res = await fetch('https://api.cloudinary.com/v1_1/SEU_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      const body = {
        ...form,
        image: imageUrl,
      };

      await API.post('/travels', body);
      alert('Viagem criada com sucesso!');
      navigate('/my-travels');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar viagem.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar nova viagem</h2>
      <input name="title" placeholder="Título" onChange={handleChange} required />
      <textarea name="description" placeholder="Descrição" onChange={handleChange} required />
      <input name="location" placeholder="Localização" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <select name="visibility" onChange={handleChange}>
        <option value="public">Pública</option>
        <option value="private">Privada</option>
      </select>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
      <button type="submit">Salvar</button>
    </form>
  );
}