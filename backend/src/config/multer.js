const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('../middleware/errorHandler');

// Criar diretórios se não existirem
const uploadsDir = path.join(__dirname, '../../uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
const postsDir = path.join(uploadsDir, 'posts');
const tripsDir = path.join(uploadsDir, 'trips');

[uploadsDir, profilesDir, postsDir, tripsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    if (file.fieldname === 'profilePhoto') {
      uploadPath = profilesDir;
    } else if (file.fieldname === 'images') {
      uploadPath = postsDir;
    } else if (file.fieldname === 'coverImage') {
      uploadPath = tripsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    const prefix = file.fieldname === 'profilePhoto' ? 'profile-' : 
                  file.fieldname === 'images' ? 'post-' : 
                  file.fieldname === 'coverImage' ? 'trip-' : '';
    
    cb(null, prefix + uniqueSuffix + '-' + sanitizedName);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Tipo de arquivo não suportado. Use apenas imagens (JPEG, JPG, PNG, WEBP)', 400), false);
  }
};

// Configurações do multer
const uploadProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

const uploadPost = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  }
});

const uploadTrip = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

// Middleware para tratamento de erros do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('Arquivo muito grande. Tamanho máximo permitido: 10MB', 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Número máximo de arquivos excedido', 400));
    }
    return next(new AppError('Erro no upload do arquivo', 400));
  }
  next(err);
};

module.exports = {
  uploadProfile,
  uploadPost,
  uploadTrip,
  handleMulterError
}; 