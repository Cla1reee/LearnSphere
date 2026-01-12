import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Image } from 'react-bootstrap';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const EditCoursePage = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', level: 'beginner'
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true); // Loading awal fetch data
    const [error, setError] = useState('');

    // 1. Ambil Data Lama
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                const data = res.data;
                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    level: data.level
                });
                // Set preview gambar lama
                if (data.imageUrl) {
                    setPreview(`http://localhost:3000/${data.imageUrl}`);
                }
                setLoading(false);
            } catch (err) {
                setError('Gagal mengambil data kursus.');
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
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

            // Ganti POST jadi PUT
            await api.put(`/courses/${id}`, data);
            
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal update kursus.');
            setLoading(false);
        }
    };

    if (loading && !formData.title) return <Container className="mt-5 text-center">Loading...</Container>;

    return (
        <Container className="d-flex justify-content-center mt-5 mb-5">
            <Card style={{ width: '600px' }} className="shadow">
                <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Edit Kursus</h4>
                    <Button variant="light" size="sm" onClick={() => navigate('/dashboard')}>✕ Batal</Button>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Kursus</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Harga</Form.Label>
                                    <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Level</Form.Label>
                                    <Form.Select name="level" value={formData.level} onChange={handleChange}>
                                        <option value="beginner">Pemula</option>
                                        <option value="intermediate">Menengah</option>
                                        <option value="advanced">Mahir</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Ganti Cover (Opsional)</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                            {preview && (
                                <div className="mt-3 text-center">
                                    <Image src={preview} thumbnail style={{ maxHeight: '200px' }} />
                                    <div className="small text-muted mt-1">Preview Gambar</div>
                                </div>
                            )}
                        </Form.Group>

                        <Button variant="warning" type="submit" className="w-100" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditCoursePage;