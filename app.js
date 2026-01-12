const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');
const User = require('./src/models/user');
const authRoutes = require('./src/routes/authRoutes'); // <--- 1. Import Route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DAFTARKAN ROUTES ---
app.use('/api/auth', authRoutes); // <--- 2. Pasang Route di sini

app.get('/', (req, res) => {
    res.send('Server LearnSphere Berjalan! 🚀');
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database MySQL berhasil terkoneksi.');
        await sequelize.sync({ alter: true });
        console.log('✅ Semua tabel berhasil digenerate otomatis.');

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal koneksi ke database:', error);
    }
};

startServer();