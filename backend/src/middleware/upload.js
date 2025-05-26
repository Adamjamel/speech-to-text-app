const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
fs.ensureDirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier audio non supporté'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max
  }
});

module.exports = upload;