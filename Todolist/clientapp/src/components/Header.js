import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { logoutUser } from '../handlers/AuthHandler';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Todo App</Navbar.Brand>
                <Nav className="ml-auto">
                    {!localStorage.getItem('token') ? (
                        <>
                            <Nav.Link href="/login">Logg Inn</Nav.Link>
                            <Nav.Link href="/register">Registrer</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link href="/shared-todos">Delte Todos</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logg Ut</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;