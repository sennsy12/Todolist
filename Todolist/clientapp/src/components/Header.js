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
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {localStorage.getItem('token') && (
                            <>
                                <Nav.Link href="/todos">Personal Todos</Nav.Link>
                                <Nav.Link href="/todo-lists">Shared Lists</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {!localStorage.getItem('token') ? (
                            <>
                                <Nav.Link href="/login">Logg Inn</Nav.Link>
                                <Nav.Link href="/register">Registrer</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link onClick={handleLogout}>Logg Ut</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
