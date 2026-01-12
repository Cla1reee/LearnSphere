const express = require('express');
const router = express.Router();
// Pastikan nama file controller sesuai (huruf besar/kecil berpengaruh di Linux/Mac)
const courseController = require('../controllers/coursecontroller'); 
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// --- PUBLIC ROUTES ---
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// --- PROTECTED ROUTES (Butuh Login) ---

// 1. Buat Kursus
router.post('/', authMiddleware, upload.single('image'), courseController.createCourse);

// 2. Lihat Siswa (Endpoint BARU)
// URL: GET http://localhost:5000/api/courses/6/students
router.get('/:id/students', authMiddleware, courseController.getCourseStudents);

// 3. Update Kursus
router.put('/:id', authMiddleware, upload.single('image'), courseController.updateCourse);

// 4. Hapus Kursus
router.delete('/:id', authMiddleware, courseController.deleteCourse);

module.exports = router;