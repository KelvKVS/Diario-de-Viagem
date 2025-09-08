const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diarioViagem', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('✗ Erro no MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 