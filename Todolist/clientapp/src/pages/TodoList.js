import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Modal, Badge } from 'react-bootstrap';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../handlers/apiHandler';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            setLoading(true);
            const data = await fetchTodos();
            setTodos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Kunne ikke laste oppgaver');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (newTodo) => {
        try {
            setLoading(true);
            const data = await addTodo(newTodo);
            setTodos([...todos, data]);
        } catch (err) {
            setError('Kunne ikke legge til oppgave');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setShowModal(true);
    };

    const handleSaveEdit = async (updatedTodo) => {
        try {
            setLoading(true);
            await updateTodo(updatedTodo);
            setTodos(todos.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo
            ));
            setShowModal(false);
        } catch (err) {
            setError('Kunne ikke oppdatere oppgave');
        } finally {
            setLoading(false);
            setEditingTodo(null);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('Kunne ikke slette oppgave');
        }
    };

    const handleToggleComplete = async (todo) => {
        const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
        await handleSaveEdit(updatedTodo);
    };

    return (
        <Container className="py-5">
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Row className="justify-content-center">
                <Col lg={8}>
                    <div className="mb-5">
                        <h2 className="mb-3">Legg til ny oppgave</h2>
                        <TodoForm onSubmit={handleAddTodo} loading={loading} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Oppgaveliste</h1>
                        <Badge bg="primary">
                            {todos.length} {todos.length === 1 ? 'oppgave' : 'oppgaver'}
                        </Badge>
                    </div>
                    <div>
                        {todos.length === 0 ? (
                            <Alert variant="info">Ingen oppgaver tilgjengelig. Legg til din første oppgave!</Alert>
                        ) : (
                            todos.map(todo => (
                                todo.id ? (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onEdit={handleEditTodo}
                                        onDelete={handleDeleteTodo}
                                        onToggleComplete={handleToggleComplete}
                                    />
                                ) : (
                                    <Alert variant="danger" key={Math.random()}>
                                        En oppgave mangler ID. Sjekk backend.
                                    </Alert>
                                )
                            ))
                        )}
                    </div>

                    {/* Modal for editing todo */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Rediger oppgave</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <TodoForm
                                initialTodo={editingTodo}
                                onSubmit={handleSaveEdit}
                                loading={loading}
                            />
                        </Modal.Body>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default TodoList;