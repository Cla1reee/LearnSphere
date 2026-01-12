const express = require('express');
const router = express.Router();

// Import Controller (Pastikan path-nya '../controllers/enrollmentController')
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Validasi Controller (Cek apakah file controller terbaca)
if (!enrollmentController) {
    throw new Error("Controller Enrollment tidak ditemukan atau gagal di-load.");
}

// Pasang Satpam (Wajib Login)
router.use(authMiddleware);

// --- ROUTES ---
router.post('/', enrollmentController.enrollCourse);         // Create Enrollment
router.get('/my-courses', enrollmentController.getMyCourses); // Get My Courses

// --- WAJIB ADA DI BARIS TERAKHIR ---
module.exports = router;