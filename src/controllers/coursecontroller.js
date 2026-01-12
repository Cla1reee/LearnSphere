// PENTING: Import dari index models agar relasi (associations) terbaca
const { Course, User, Enrollment } = require('../models');

// 1. LIHAT SEMUA KURSUS (Public)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{
                model: User,
                as: 'instructor', // Pastikan di models/index.js ada alias ini, jika error ganti jadi 'User' atau hapus 'as'
                attributes: ['name', 'email']
            }]
        });
        res.json(courses);
    } catch (error) {
        // Fallback jika alias 'instructor' belum diset, coba query standar
        console.error("Error detail:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. BUAT KURSUS BARU (Private)
exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, level } = req.body;
        const instructorId = req.user.id;
        
        const imageUrl = req.file ? req.file.path : null; 

        const newCourse = await Course.create({
            title,
            description,
            price,
            level,
            imageUrl,
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

// 3. LIHAT DETAIL SATU KURSUS (Public)
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [{ 
                model: User, 
                as: 'instructor', // Sesuaikan alias dengan model
                attributes: ['name'] 
            }]
        });
        if (!course) return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. UPDATE KURSUS (Private - Owner Only)
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, level } = req.body;
        const userId = req.user.id;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        // CEK KEPEMILIKAN
        if (course.instructorId !== userId) {
            return res.status(403).json({ message: 'Anda tidak berhak mengedit kursus ini!' });
        }

        const imageUrl = req.file ? req.file.path : course.imageUrl;

        await course.update({
            title, description, price, level, imageUrl
        });

        res.json({ message: 'Kursus berhasil diperbarui!', course });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 5. DELETE KURSUS (Private - Owner Only)
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        if (course.instructorId !== userId) {
            return res.status(403).json({ message: 'Anda tidak berhak menghapus kursus ini!' });
        }

        await course.destroy();

        res.json({ message: 'Kursus berhasil dihapus permanen.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 6. LIHAT SISWA DI KURSUS (Private - Owner Only) [BARU]
exports.getCourseStudents = async (req, res) => {
    try {
        const { id } = req.params; // ID Course
        const instructorId = req.user.id; // ID Instruktur dari token

        // Cari Course & Validasi Pemilik
        const course = await Course.findOne({
            where: { 
                id: id,
                instructorId: instructorId // Filter keamanan
            },
            include: [
                {
                    model: User,
                    as: 'students', // Wajib sama dengan alias di models/index.js
                    attributes: ['id', 'name', 'email'], 
                    through: {
                        model: Enrollment,
                        attributes: ['enrolledAt'] 
                    }
                }
            ]
        });

        if (!course) {
            return res.status(404).json({ 
                message: 'Kursus tidak ditemukan atau Anda bukan instruktur kursus ini.' 
            });
        }

        res.json({
            message: 'Berhasil mengambil data siswa',
            totalStudents: course.students.length,
            data: course.students
        });

    } catch (error) {
        console.error("Error getCourseStudents:", error);
        res.status(500).json({ 
            message: 'Gagal mengambil data siswa. Cek relasi model Anda.', 
            error: error.message 
        });
    }
};