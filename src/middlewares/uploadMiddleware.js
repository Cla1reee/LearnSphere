const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan di folder uploads
    },
    filename: (req, file, cb) => {
        // Nama file: timestamp-namaasli.jpg (biar gak bentrok)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filter hanya boleh gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Format file harus JPG atau PNG!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Maksimal 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;