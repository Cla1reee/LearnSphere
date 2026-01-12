const Course = require('../models/course');
const User = require('../models/user');

// 1. LIHAT SEMUA KURSUS (Bisa diakses publik)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{ // Kita ikut sertakan data Instruktur (User)
                model: User,
                attributes: ['name', 'email'] // Ambil nama & email saja, password jangan
            }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. BUAT KURSUS BARU (Hanya user login)
exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, level } = req.body;
        const instructorId = req.user.id;
        
        // Cek apakah ada file yang diupload?
        // Jika ada, ambil path-nya. Jika tidak, null.
        const imageUrl = req.file ? req.file.path : null; 

        const newCourse = await Course.create({
            title,
            description,
            price,
            level,
            imageUrl, // <--- Simpan path gambar ke DB
            instructorId
        });

        res.status(201).json({
            message: 'Kursus berhasil dibuat!',
            course: newCourse
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat kursus', error: error.message });
    }
};

// 3. LIHAT DETAIL SATU KURSUS
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name'] }]
        });
        if (!course) return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. UPDATE KURSUS (Edit)
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, level } = req.body;
        const userId = req.user.id; // ID user yang sedang login

        // Cari kursus berdasarkan ID
        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        // CEK KEPEMILIKAN: Apakah yang edit adalah pemilik kursus?
        if (course.instructorId !== userId) {
            return res.status(403).json({ message: 'Anda tidak berhak mengedit kursus ini!' });
        }

        // Cek ada gambar baru atau tidak?
        // Jika ada upload baru, pakai path baru. Jika tidak, pakai yang lama.
        const imageUrl = req.file ? req.file.path : course.imageUrl;

        // Lakukan update
        await course.update({
            title,
            description,
            price,
            level,
            imageUrl
        });

        res.json({ message: 'Kursus berhasil diperbarui!', course });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 5. DELETE KURSUS (Hapus)
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        // CEK KEPEMILIKAN
        if (course.instructorId !== userId) {
            return res.status(403).json({ message: 'Anda tidak berhak menghapus kursus ini!' });
        }

        await course.destroy(); // Hapus dari database

        res.json({ message: 'Kursus berhasil dihapus permanen.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};