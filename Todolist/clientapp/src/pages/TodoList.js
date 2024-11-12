// TodoList.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Modal, Badge, Form, Button, Pagination } from 'react-bootstrap';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoAccordion from '../components/TodoAccordion';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../handlers/apiHandler';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            loadTodos();
        }
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
            setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
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

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const filteredTodos = selectedCategory === ''
        ? todos
        : todos.filter(todo => todo.category === selectedCategory);

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
    const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

    return (
        <Container className="py-5">
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Row>
                <Col lg={4} className="mb-4">
                    <div className="mb-5">
                        <h2 className="mb-3">Legg til ny oppgave</h2>
                        <TodoForm
                            onSubmit={handleAddTodo}
                            loading={loading}
                            categories={Array.from(new Set(todos.map(todo => todo.category)))}
                        />
                    </div>
                </Col>

                <Col lg={8}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Oppgaveliste</h1>
                        <Badge bg="primary">
                            {todos.length} {todos.length === 1 ? 'oppgave' : 'oppgaver'}
                        </Badge>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Kategorier</Form.Label>
                        <Form.Select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Alle</option>
                            {Array.from(new Set(todos.map(todo => todo.category))).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <TodoAccordion
                        todos={currentTodos}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                        onToggleComplete={handleToggleComplete}
                    />

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center mt-3">
                            <Pagination.First
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    )}

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Rediger oppgave</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <TodoForm
                                initialTodo={editingTodo}
                                onSubmit={handleSaveEdit}
                                loading={loading}
                                categories={Array.from(new Set(todos.map(todo => todo.category)))}
                            />
                        </Modal.Body>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default TodoList;
