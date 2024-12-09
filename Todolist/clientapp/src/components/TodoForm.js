import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';

const TodoForm = ({ initialTodo, onSubmit, loading, show, onHide }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isCompleted: false,
        dueDate: '',
        dueTime: '',
        category: '',
        priority: 'Low'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            dueDateTime: formData.dueDate && formData.dueTime
                ? new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString()
                : null
        };

        onSubmit(formattedData);
    };

    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const predefinedCategories = [
        { value: 'Arbeid', label: 'Arbeid 💼' },
        { value: 'Personlig', label: 'Personlig 🏠' },
        { value: 'Studie', label: 'Studie 📚' },
        { value: 'Trening', label: 'Trening 🏃' },
        { value: 'Møte', label: 'Møte 👥' },
        { value: 'Annet', label: 'Annet (Egendefinert) 📌' }
    ];

    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setIsCustomCategory(selectedValue === 'annet');
        setFormData({ ...formData, category: selectedValue });
    };

    useEffect(() => {
        if (initialTodo) {
            const dueDateTime = initialTodo.dueDateTime ? new Date(initialTodo.dueDateTime) : null;
            setFormData({
                ...initialTodo,
                dueDate: dueDateTime ? dueDateTime.toISOString().split('T')[0] : '',  
                dueTime: dueDateTime ? dueDateTime.toTimeString().split(' ')[0].substring(0, 5) : ''  
            });
        }
    }, [initialTodo]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialTodo ? 'Oppdater Oppgave' : 'Ny Oppgave'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Tittel</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Skriv inn oppgavetittel"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Beskrivelse</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Skriv inn oppgavebeskrivelse"
                />
            </Form.Group>

            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Forfallsdato</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Forfallstid</Form.Label>
                        <Form.Control
                            type="time"
                            value={formData.dueTime}
                            onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                        />
                    </Form.Group>
                </Col>
            </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Kategori</Form.Label>
                        <Form.Select
                            value={formData.category}
                            onChange={handleCategoryChange}
                            className="mb-2"
                        >
                            <option value="">Velg kategori</option>
                            {predefinedCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </Form.Select>

                        {isCustomCategory && (
                            <Form.Control
                                type="text"
                                value={formData.customCategory}
                                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                placeholder="Skriv inn egendefinert kategori"
                            />
                        )}
                    </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Prioritet</Form.Label>
                <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                    <option value="Low">Lav</option>
                    <option value="Medium">Middels</option>
                    <option value="High">Høy</option>
                </Form.Select>
            </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="w-100"
                    >
                        {loading ? 'Lagrer...' : (initialTodo ? 'Oppdater oppgave' : 'Legg til oppgave')}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TodoForm;