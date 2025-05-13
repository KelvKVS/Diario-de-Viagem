// models/Viagem.js
const mongoose = require('mongoose');

const viagemSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  data: Date,
  local: String,
  imagem: String,
  visibilidade: {
    type: String,
    enum: ['publica', 'privada'],
    default: 'privada',
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
});

module.exports = mongoose.model('Viagem', viagemSchema);