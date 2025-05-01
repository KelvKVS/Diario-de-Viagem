import express from 'express'

const app = express()

app.get('/home', (req, res) => {
  res.send('Teste')
})

app.listen(3000)