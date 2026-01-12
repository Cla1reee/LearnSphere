import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

// TAMBAHKAN prop 'onViewStudents' di sini
const CourseCard = ({ course, onEnroll, isOwner, userRole, onEdit, onDelete, onViewStudents }) => {
    
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    // Pastikan port backend sesuai (misal 5000 atau 3000)
    const imageUrl = course.imageUrl ? `http://localhost:5000/${course.imageUrl}` : 'https://via.placeholder.com/300';

    return (
        <Card className="h-100 shadow-sm">
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <Card.Img variant="top" src={imageUrl} style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
            </div>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="info">{course.level}</Badge>
                    <span className="fw-bold text-primary">{formatRupiah(course.price)}</span>
                </div>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">
                    {course.description.substring(0, 100)}...
                </Card.Text>
                
                <div className="mt-3">
                    <small className="text-muted d-block mb-2">👤 {course.instructor?.name || course.User?.name || 'Instruktur'}</small>
                    
                    {isOwner ? (
                        // KONDISI 1: PEMILIK KURSUS
                        <div className="d-flex flex-column gap-2">
                            {/* --- TOMBOL BARU DISINI --- */}
                            <Button variant="success" size="sm" className="w-100" onClick={() => onViewStudents(course.id)}>
                                👥 Lihat Siswa
                            </Button>

                            <div className="d-flex gap-2">
                                <Button variant="warning" size="sm" className="w-50" onClick={() => onEdit(course.id)}>
                                    ✏️ Edit
                                </Button>
                                <Button variant="danger" size="sm" className="w-50" onClick={() => onDelete(course.id)}>
                                    🗑️ Hapus
                                </Button>
                            </div>
                        </div>
                    ) : userRole === 'instructor' ? (
                        // KONDISI 2: INSTRUKTUR LAIN
                        <Button variant="secondary" className="w-100" disabled>
                            👁️ Mode Instruktur
                        </Button>
                    ) : (
                        // KONDISI 3: STUDENT
                        <Button variant="primary" className="w-100" onClick={() => onEnroll(course.id)}>
                            Daftar Sekarang
                        </Button>
                    )}
                    
                </div>
            </Card.Body>
        </Card>
    );
};

export default CourseCard;