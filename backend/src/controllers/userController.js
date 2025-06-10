const Usuario = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');

const SECRET = "your_jwt_secret";

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoUsuario = new Usuario({
      name,
      email,
      password: hashedPassword,
    });

    await novoUsuario.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro no registro" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ userId: usuario._id }, SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.files || !req.files.profilePhoto) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const userId = req.userId; // From auth middleware
    const file = req.files.profilePhoto[0];
    
    // Garantir que o caminho começa com /uploads
    const profilePhotoPath = `/uploads/${file.filename}`;

    const updatedUser = await Usuario.findByIdAndUpdate(
      userId,
      { profilePhoto: profilePhotoPath },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({
      message: "Foto de perfil atualizada com sucesso",
      profilePhoto: profilePhotoPath,
      user: updatedUser
    });
  } catch (err) {
    console.error('Erro ao fazer upload da foto:', err);
    res.status(500).json({ error: "Erro ao fazer upload da foto de perfil" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { name, email, bio, location } = req.body;

    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const existingUser = await Usuario.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Este email já está em uso" });
      }
    }

    const updatedUser = await Usuario.findByIdAndUpdate(
      userId,
      { 
        name,
        email,
        bio,
        location
      },
      { new: true, select: '-password' } // Excluir senha do retorno
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
};
