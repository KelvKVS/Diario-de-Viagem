const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const viagemRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = 3000;
const tripRoutes = require('./routes/tripRoutes');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/diarioViagem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Erro no MongoDB:', err));

app.use('/', viagemRoutes);
app.use('/', userRoutes);
app.use('/', tripRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});