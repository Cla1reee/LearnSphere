import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const result = await register(
            formData.name, 
            formData.email, 
            formData.password, 
            formData.role
        );

        if (result.success) {
            setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="p-4 shadow-sm">
                <h2 className="text-center mb-4">Daftar Akun</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Lengkap</Form.Label>
                        <Form.Control type="text" name="name" onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Peran</Form.Label>
                        <Form.Select name="role" onChange={handleChange}>
                            <option value="student">Siswa (Student)</option>
                            <option value="instructor">Instruktur (Guru)</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100">
                        Daftar Sekarang
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default RegisterPage;