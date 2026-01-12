const Enrollment = require('../models/enrollment');
const Course = require('../models/course');

// 1. DAFTAR KURSUS
exports.enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id; 

        // Cek kursus
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan!' });
        }

        // Cek duplikat
        const existingEnrollment = await Enrollment.findOne({
            where: { userId, courseId }
        });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Kamu sudah terdaftar di kursus ini.' });
        }

        await Enrollment.create({ userId, courseId });
        res.status(201).json({ message: 'Berhasil mendaftar kursus!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. LIHAT KURSUS SAYA
exports.getMyCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollments = await Enrollment.findAll({
            where: { userId },
            include: [{
                model: Course,
                attributes: ['title', 'description', 'level']
            }]
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};