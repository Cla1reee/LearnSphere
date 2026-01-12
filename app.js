const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');

// --- LOAD MODEL ---
const User = require('./src/models/user');
const Course = require('./src/models/course'); // <--- 1. Import Course

// --- DEFINISI RELASI (ASSOCIATIONS) ---
// User (Instruktur) punya banyak Kursus
User.hasMany(Course, { foreignKey: 'instructorId' });
// Kursus dimiliki oleh satu User
Course.belongsTo(User, { foreignKey: 'instructorId' });

const authRoutes = require('./src/routes/authRoutes');

dotenv.config();

// ... (kode ke bawah sama saja, tidak perlu diubah)