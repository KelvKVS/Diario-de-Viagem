const soma = (req, res) => {

    const soma = 2 + 7;
  
    res.send({ soma: soma });
  }
  
  module.exports = { soma };