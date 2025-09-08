const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");

// Sistema de Amizades
router.get("/search", authMiddleware, friendController.searchUsers);
router.get("/search-friends", authMiddleware, friendController.searchFriends);
router.post("/send-request", authMiddleware, friendController.sendFriendRequest);
router.post("/accept-request", authMiddleware, friendController.acceptFriendRequest);
router.post("/reject-request", authMiddleware, friendController.rejectFriendRequest);
router.get("/friends/:userId", authMiddleware, friendController.getFriends);
router.get("/requests/:userId", authMiddleware, friendController.getPendingRequests);

// Upload de foto de perfil
router.post("/profile-photo", authMiddleware, upload, userController.uploadProfilePhoto);

// Atualização de perfil
router.put("/profile", authMiddleware, userController.updateProfile);

// Rotas protegidas de teste
router.get("/usuarios-protegidos", authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, usuário ${req.userId}` });
});

router.get("/test", (req, res) => {
  res.json({ message: "Rota GET funcionando!" });
});

module.exports = router;