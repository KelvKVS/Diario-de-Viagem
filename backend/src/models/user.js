const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  
});

module.exports = mongoose.model('Usuario', usuarioSchema);