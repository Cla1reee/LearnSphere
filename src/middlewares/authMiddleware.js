const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // 1. Ambil token dari header (Format: "Bearer <token>")
    const tokenHeader = req.header('Authorization');

    // Jika tidak ada token
    if (!tokenHeader) {
        return res.status(401).json({ message: 'Akses ditolak! Silakan login terlebih dahulu.' });
    }

    try {
        // 2. Buang kata "Bearer " untuk ambil token aslinya saja
        const token = tokenHeader.replace('Bearer ', '');

        // 3. Verifikasi token dengan kunci rahasia
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Simpan data user ke dalam request agar bisa dipakai di Controller nanti
        req.user = decoded; 
        
        next(); // Lanjut ke proses berikutnya
    } catch (error) {
        res.status(400).json({ message: 'Token tidak valid!' });
    }
};