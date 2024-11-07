// components/TodoForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const TodoForm = ({ initialTodo, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isCompleted: false
    });

    useEffect(() => {
        if (initialTodo) {
            setFormData(initialTodo);
        }
    }, [initialTodo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        if (!initialTodo) {
            setFormData({ title: '', description: '', isCompleted: false });
        }
    };

    return (
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

            <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100"
            >
                {loading ? 'Lagrer...' : (initialTodo ? 'Oppdater oppgave' : 'Legg til oppgave')}
            </Button>
        </Form>
    );
};

export default TodoForm;