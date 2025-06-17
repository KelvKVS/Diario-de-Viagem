const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const corsOptions = require('./config/cors');
const setupUploadsDir = require('./config/uploads');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Configurar diretório de uploads
const uploadsDir = setupUploadsDir();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conectar ao banco de dados
connectDB();

// Rotas
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;