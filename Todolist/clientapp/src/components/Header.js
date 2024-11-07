import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Todo App</Navbar.Brand>
                <Nav className="ml-auto">
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
