const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/usuarios-protegidos", authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, usuário ${req.userId}` });
});

router.get('/test', (req, res) => {
  res.json({ message: 'Rota GET funcionando!' });
});


module.exports = router;
