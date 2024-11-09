import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const TodoForm = ({ initialTodo, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isCompleted: false,
        dueDate: '',  
        category: '',  
        priority: 'Low'  
    });

    const formatInputDate = (dateString) => {
        if (!dateString) return '';  
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];  
    };

    useEffect(() => {
        if (initialTodo) {
            setFormData({
                ...initialTodo,
                dueDate: formatInputDate(initialTodo.dueDate) 
            });
        }
    }, [initialTodo]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const dueDateUTC = formData.dueDate ? new Date(formData.dueDate).toISOString() : null;

        onSubmit({
            ...formData,
            dueDate: dueDateUTC
        });

        if (!initialTodo) {
            setFormData({ title: '', description: '', isCompleted: false, dueDate: '', category: '', priority: 'Low' });
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
            <Form.Group className="mb-3">
                <Form.Label>Forfallsdato</Form.Label>
                <Form.Control
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Kategori</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Skriv inn kategori"
                />
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
    );
};

export default TodoForm;