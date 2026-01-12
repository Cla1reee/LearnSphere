import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import CourseCard from '../components/CourseCard';

const DashboardPage = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    // Fungsi fetch data
    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (err) {
            setError('Gagal mengambil data kursus.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Logic Enroll (Daftar)
    const handleEnroll = async (courseId) => {
        try {
            setError('');
            setSuccessMsg('');
            await api.post('/enrollments', { courseId });
            setSuccessMsg('✅ Berhasil mendaftar kursus!');
            window.scrollTo(0, 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mendaftar.');
            window.scrollTo(0, 0);
        }
    };

    // --- FITUR BARU: LIHAT SISWA ---
    const handleViewStudents = async (courseId) => {
        try {
            // Gunakan api instance agar token otomatis terkirim
            const res = await api.get(`/courses/${courseId}/students`);
            
            const { totalStudents, data } = res.data;

            // Format tampilan alert sederhana
            const studentList = data
                .map((s, index) => `${index + 1}. ${s.name} (${s.email})`)
                .join('\n');

            alert(`👥 Total Siswa: ${totalStudents}\n\n${studentList || 'Belum ada siswa yang mendaftar.'}`);

        } catch (err) {
            console.error("Error viewing students:", err);
            const msg = err.response?.data?.message || 'Gagal mengambil data siswa.';
            alert(`❌ Error: ${msg}`);
        }
    };

    // Logic Pindah Halaman ke Edit
    const handleEdit = (courseId) => {
        navigate(`/edit-course/${courseId}`);
    };

    // Logic Hapus Kursus
    const handleDelete = async (courseId) => {
        if (window.confirm('Yakin ingin menghapus kursus ini secara permanen?')) {
            try {
                await api.delete(`/courses/${courseId}`);
                setSuccessMsg('🗑️ Kursus berhasil dihapus.');
                fetchCourses(); // Refresh list tanpa reload
                window.scrollTo(0, 0);
            } catch (err) {
                setError('Gagal menghapus kursus.');
            }
        }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📚 Daftar Kursus Tersedia</h2>
                {user?.role === 'instructor' && (
                    <Button variant="success" onClick={() => navigate('/create-course')}>
                        + Buat Kursus Baru
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            {courses.length === 0 ? (
                <Alert variant="info">Belum ada kursus yang tersedia saat ini.</Alert>
            ) : (
                <Row xs={1} md={3} className="g-4">
                    {courses.map((course) => (
                        <Col key={course.id}>
                            <CourseCard 
                                course={course} 
                                onEnroll={handleEnroll} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                // --- BAGIAN PENTING YANG TADI HILANG ---
                                onViewStudents={handleViewStudents} 
                                // ---------------------------------------
                                
                                isOwner={user?.id === course.instructorId} 
                                userRole={user?.role} 
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default DashboardPage;