import React, { useState } from 'react';
// 1. TAMBAHKAN Row dan Col (dan Image untuk preview) KE DALAM IMPORT
import { Container, Form, Button, Alert, Card, Row, Col, Image } from 'react-bootstrap';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', level: 'beginner'
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null); // 2. State untuk preview gambar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // 3. Logic Preview Gambar
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('level', formData.level);
            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/courses', data);
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat kursus.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5 mb-5">
            <Card style={{ width: '600px' }} className="shadow">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Buat Kursus Baru</h4>
                    {/* Tombol Batal */}
                    <Button variant="light" size="sm" onClick={() => navigate('/dashboard')}>
                        ✕ Batal
                    </Button>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Kursus</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title" 
                                placeholder="Contoh: Belajar React dari Nol"
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="description" 
                                placeholder="Jelaskan apa yang akan dipelajari..."
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Harga (Rp)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="price" 
                                        placeholder="0"
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Level</Form.Label>
                                    <Form.Select name="level" onChange={handleChange}>
                                        <option value="beginner">Pemula</option>
                                        <option value="intermediate">Menengah</option>
                                        <option value="advanced">Mahir</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Cover Gambar (Opsional)</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                            
                            {/* 4. Tampilkan Preview jika ada gambar yang dipilih */}
                            {preview && (
                                <div className="mt-3 text-center">
                                    <Image src={preview} thumbnail style={{ maxHeight: '200px' }} />
                                    <div className="small text-muted mt-1">Preview Cover</div>
                                </div>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? 'Sedang Upload...' : '🚀 Terbitkan Kursus'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateCoursePage;