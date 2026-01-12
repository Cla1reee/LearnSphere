// 1. IMPORT KONEKSI DATABASE (Ini yang tadi hilang/kurang)
// Pastikan path '../config/database' mengarah ke file konfigurasi DB Anda
const sequelize = require('../config/database'); 
const { DataTypes } = require('sequelize');

// 2. IMPORT MODEL
// Asumsi: File model Anda mengekspor fungsi definisi model atau instance model
const User = require('./user');
const Course = require('./course');
const Enrollment = require('./enrollment');

// 3. DEFINISI RELASI (ASSOCIATIONS)
// Relasi Many-to-Many (Siswa <-> Kursus)
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'courseId',
  as: 'students' // Alias penting untuk controller getCourseStudents
});

User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'userId',
  as: 'enrolledCourses'
});

// Relasi One-to-Many (Instruktur -> Kursus)
User.hasMany(Course, { 
    foreignKey: 'instructorId', 
    as: 'teachingCourses' 
});

Course.belongsTo(User, { 
    foreignKey: 'instructorId', 
    as: 'instructor' 
});

// 4. EKSPOR MODULE
// Sekarang 'sequelize' sudah didefinisikan di baris 3, jadi aman untuk diekspor
module.exports = { 
    sequelize, 
    User, 
    Course, 
    Enrollment 
};