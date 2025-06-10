const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");

// Autenticação
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.get("/verify-token", authMiddleware, authController.verifyToken);

// Sistema de Amizades
router.get("/search", authMiddleware, friendController.searchUsers);
router.post("/send-request", authMiddleware, friendController.sendFriendRequest);
router.post("/accept-request", authMiddleware, friendController.acceptFriendRequest);
router.post("/reject-request", authMiddleware, friendController.rejectFriendRequest);
router.get("/friends/:userId", authMiddleware, friendController.getFriends); 
router.get("/requests/:userId", authMiddleware, friendController.getPendingRequests); 

// Rotas protegidas de teste
router.get("/usuarios-protegidos", authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, usuário ${req.userId}` });
});

router.get("/test", (req, res) => {
  res.json({ message: "Rota GET funcionando!" });
});

module.exports = router;