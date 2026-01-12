import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Ambil data user dari Context

const NavigationBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                {/* Brand / Logo */}
                <Navbar.Brand as={Link} to="/">LearnSphere 🎓</Navbar.Brand>
                
                {/* Tombol Hamburger untuk Mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        
                        {/* LOGIC: Cek apakah ada user login? */}
                        {user ? (
                            <>
                                {/* Tampilan kalau SUDAH LOGIN */}
                                <Nav.Link as={Link} to="/dashboard" className="text-white">
                                    Dashboard
                                </Nav.Link>
                                
                                <span className="text-white mx-3">
                                    Halo, <strong>{user.name}</strong> ({user.role})
                                </span>
                                
                                <Button variant="light" size="sm" className="text-primary fw-bold" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Tampilan kalau BELUM LOGIN (Tamu) */}
                                <Nav.Link as={Link} to="/login" className="text-white">
                                    Login
                                </Nav.Link>
                                
                                <Nav.Link as={Link} to="/register">
                                    <Button variant="light" size="sm" className="text-primary fw-bold">
                                        Daftar Sekarang
                                    </Button>
                                </Nav.Link>
                            </>
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;