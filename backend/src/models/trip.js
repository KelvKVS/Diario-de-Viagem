const mongoose = require('mongoose');

const viagemSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  image: String,
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