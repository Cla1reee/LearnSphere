const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');
const path = require('path'); // <--- Import path bawaan nodejs

// --- 1. LOAD MODELS ---
const User = require('./src/models/user');
const Course = require('./src/models/course');
const Enrollment = require('./src/models/enrollment'); // <--- Tambahan: Model Enrollment

// --- 2. DEFINISI RELASI (ASSOCIATIONS) ---

// A. Relasi Instruktur & Kursus (One-to-Many)
User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { foreignKey: 'instructorId' });

// B. Relasi Siswa & Pendaftaran (One-to-Many)
// Satu user bisa punya banyak data pendaftaran
User.hasMany(Enrollment, { foreignKey: 'userId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });

// C. Relasi Kursus & Pendaftaran (One-to-Many)
// Satu kursus bisa punya banyak pendaftar
Course.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// --- 3. LOAD ROUTES ---
const authRoutes = require('./src/routes/authRoutes');
// Pastikan nama file di folder routes sesuai (besar/kecilnya)
const courseRoutes = require('./src/routes/courseroutes'); 
const enrollmentRoutes = require('./src/routes/enrollmentRoutes'); // <--- Tambahan: Route Enrollment

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 4. DAFTARKAN ROUTES (ENDPOINTS) ---
app.use('/api/auth', authRoutes);           // Login & Register
app.use('/api/courses', courseRoutes);      // CRUD Kursus
app.use('/api/enrollments', enrollmentRoutes); // <--- Tambahan: Daftar Kursus
// Agar folder 'uploads' bisa diakses publik lewat URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Cek Server
app.get('/', (req, res) => {
    res.send('Server LearnSphere Berjalan! 🚀');
});

// --- 5. START SERVER ---
const startServer = async () => {
    try {
        // Cek koneksi database
        await sequelize.authenticate();
        console.log('✅ Database MySQL berhasil terkoneksi.');

        // Sinkronisasi Tabel (alter: true akan update struktur tabel jika ada perubahan)
        await sequelize.sync({ alter: true });
        console.log('✅ Semua tabel (User, Course, Enrollment) berhasil disinkronkan.');

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal koneksi ke database:', error);
    }
};

startServer();