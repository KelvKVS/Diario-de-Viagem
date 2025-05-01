import express from 'express'

const app = express()

app.get('/home', (req, res) => {
  res.send('Testes q dmssss')
})

app.listen(3000)