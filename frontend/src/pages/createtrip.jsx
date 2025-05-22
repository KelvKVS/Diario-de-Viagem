import React, { useState } from 'react';

function CreateTrip() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar para o backend com fetch/axios
    console.log({ title, location, description });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Criar Nova Viagem</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título da Viagem</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Viagem para o Rio"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">Localização</label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Rio de Janeiro"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descrição</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Descreva a viagem..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Salvar Viagem</button>
      </form>
    </div>
  );
}

export default CreateTrip;
