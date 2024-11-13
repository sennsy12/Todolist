import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { resetPassword } from '../handlers/ResetPasswordHandler';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passordene samsvarer ikke');
            return;
        }

        try {
            const token = searchParams.get('token');
            await resetPassword(formData.email, token, formData.newPassword);
            setSuccess('Passordet ditt har blitt oppdatert!');
            setError(null);
            setTimeout(() => navigate('/login'), 60000); 
        } catch (err) {
            setError(err.message);
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
                            <h3 className="text-center mb-4">Sett nytt passord</h3>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>E-post</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nytt passord</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bekreft nytt passord</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Oppdater passord
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPasswordPage;
