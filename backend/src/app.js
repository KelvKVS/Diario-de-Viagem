const express = require('express')
const cors = require('cors');

const app = express()
const port = 3000

app.use(cors());

app.get('/api/hello', (req, res) => {
  res.send('Olá Mundo!')
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
