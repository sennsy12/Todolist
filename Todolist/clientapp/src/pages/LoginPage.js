import React, { useState } from 'react';
import { loginUser } from '../handlers/AuthHandler';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Alert, Card } from 'react-bootstrap';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await loginUser(credentials);
            navigate('/'); // Naviger til hjemmesiden etter vellykket innlogging
        } catch (err) {
            setError(err.message || 'Innlogging mislyktes'); // Bruker feilmeldingen fra `loginUser`
        }
    };


    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <h3 className="text-center mb-4">Logg inn</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formUsername" className="mb-3">
                                    <Form.Label>Brukernavn</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Brukernavn"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Passord</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Passord"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Logg inn
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                <Button variant="link" onClick={() => navigate('/forgot-password')}>
                                    Glemt passord?
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
