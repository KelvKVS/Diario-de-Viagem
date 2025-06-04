const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const tripRoutes = require('./routes/tripRoutes');
const imageRoutes = require('./routes/imageRoutes');
const userRoutes = require('./routes/userRoutes');

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diarioViagem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('✗ Erro no MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
  res.send('API do Diário de Viagens está funcionando!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;