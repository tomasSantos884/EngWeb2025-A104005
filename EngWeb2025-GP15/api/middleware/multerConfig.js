
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // If uploading a SIP ZIP (no :id param), save to temp folder
    if (file.mimetype === 'application/zip' || path.extname(file.originalname).toLowerCase() === '.zip') {
      const tempDir = path.join(__dirname, '../uploads', `temp_${Date.now()}`);
      fs.mkdirSync(tempDir, { recursive: true });
      cb(null, tempDir);
    } else if (req.params && req.params.id) {
      // For images/files with :id param, save to AIP folder
      const aipPath = path.join(__dirname, '../uploads/aips', req.params.id);
      fs.mkdirSync(aipPath, { recursive: true });
      cb(null, aipPath);
    } else {
      // Fallback: save to uploads root
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
  const allowed = ['.zip', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.pdf', '.txt', '.docx'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Tipo de ficheiro não permitido'), false);
    }
  cb(null, true);
  }
});

module.exports = upload;