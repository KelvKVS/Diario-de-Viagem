// src/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Criação da instância do Express
const app = express();
const port = process.env.PORT || 3000;

// Importação de rotas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const tripRoutes = require('./routes/tripRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diarioViagem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('✗ Erro no MongoDB:', err));

// Configuração das rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/comments', commentRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Diário de Viagens está funcionando!');
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});