const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado!');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;