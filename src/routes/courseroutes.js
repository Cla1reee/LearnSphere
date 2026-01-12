const express = require('express');
const router = express.Router();
const courseController = require('../controllers/coursecontroller'); // Sesuaikan nama file kamu (huruf kecil)
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // <--- 1. Import Multer

// Public
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Private + Upload Gambar
// 'image' adalah nama key di Postman nanti
router.post('/', authMiddleware, upload.single('image'), courseController.createCourse); 

// Edit Kursus (Butuh Token + Upload Gambar opsional)
router.put('/:id', authMiddleware, upload.single('image'), courseController.updateCourse);

// Hapus Kursus (Butuh Token)
router.delete('/:id', authMiddleware, courseController.deleteCourse);

module.exports = router;