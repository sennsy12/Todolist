import React, { useState, useEffect } from 'react';
import { registerUser } from '../handlers/AuthHandler';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Alert, Card } from 'react-bootstrap';

const RegisterPage = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(credentials);
            setSuccess('Registreringen var vellykket!');
            setError(null);
            setTimeout(() => navigate('/login'), 60000); 
        } catch (err) {
            setError('Registrering mislyktes');
            setSuccess(null);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate('/login'), 60000);
            return () => clearTimeout(timer); 
        }
    }, [success, navigate]);

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <h3 className="text-center mb-4">Registrer deg</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && (
                                <Alert variant="success">
                                    {success} Du blir sendt til innlogging om 1 minutt.
                                    <br />
                                    <Button
                                        variant="link"
                                        onClick={() => navigate('/login')}
                                        className="p-0 mt-2"
                                    >
                                        Klikk her for å gå til innlogging
                                    </Button>
                                </Alert>
                            )}
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
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>E-post</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Skriv inn e-post"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Registrer
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                <p>Allerede en konto? <Button variant="link" onClick={() => navigate('/login')}>Logg inn her</Button></p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
