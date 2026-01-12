import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Ambil fungsi login dari Context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="p-4 shadow-sm">
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Masukkan email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Masuk
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default LoginPage;