const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 1. Logic REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Cek apakah email sudah dipakai
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar!' });
        }

        // Buat user baru (Password otomatis di-hash oleh Hooks di Model User)
        const newUser = await User.create({ name, email, password, role });

        res.status(201).json({
            message: 'Registrasi berhasil!',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. Logic LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email atau password salah!' });
        }

        // Cek password (Bandingkan password input vs password hash di DB)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email atau password salah!' });
        }

        // Buat Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Payload (data yang disimpan di token)
            process.env.JWT_SECRET,           // Kunci rahasia dari .env
            { expiresIn: '1d' }               // Token berlaku 1 hari
        );

        res.status(200).json({
            message: 'Login berhasil!',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};