import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container className="text-center mt-5">
            <h1>Selamat Datang di LearnSphere 🎓</h1>
            <p className="lead">Platform kursus online terbaik untuk meningkatkan skillmu.</p>
            
            <div className="mt-4">
                <Link to="/register">
                    <Button variant="primary" size="lg" className="me-3">Mulai Belajar</Button>
                </Link>
                <Link to="/login">
                    <Button variant="outline-primary" size="lg">Masuk Akun</Button>
                </Link>
            </div>

            <hr className="my-5" />

            <h3>Kenapa Belajar di Sini?</h3>
            <div className="d-flex justify-content-center gap-4 mt-3">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>📚 Materi Lengkap</Card.Title>
                        <Card.Text>Dari pemula sampai mahir, semua ada di sini.</Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>🚀 Mentor Ahli</Card.Title>
                        <Card.Text>Belajar langsung dari praktisi industri.</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default HomePage;