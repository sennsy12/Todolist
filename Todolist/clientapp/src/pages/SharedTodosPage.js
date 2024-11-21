import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import TodoCard from '../components/TodoCard';
import { fetchSharedTodos, updateTodo, deleteTodo } from '../handlers/todoApiHandlers';

const SharedTodosPage = () => {
    const [sharedTodos, setSharedTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalShared: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    });

    useEffect(() => {
        loadSharedTodos();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [sharedTodos]);

    const loadSharedTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchSharedTodos();
            setSharedTodos(data);
        } catch (error) {
            console.error('Error loading shared todos:', error);
            setError('Kunne ikke laste delte oppgaver. Prøv igjen senere.');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const now = new Date();
        setStats({
            totalShared: sharedTodos.length,
            completed: sharedTodos.filter(todo => todo.isCompleted).length,
            pending: sharedTodos.filter(todo => !todo.isCompleted).length,
            overdue: sharedTodos.filter(todo =>
                !todo.isCompleted &&
                todo.dueDateTime &&
                new Date(todo.dueDateTime) < now
            ).length
        });
    };

    const handleUpdate = async (todoId, updatedData) => {
        try {
            await updateTodo(todoId, updatedData);
            await loadSharedTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Kunne ikke oppdatere oppgaven. Prøv igjen senere.');
        }
    };

    const handleDelete = async (todoId) => {
        try {
            await deleteTodo(todoId);
            await loadSharedTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Kunne ikke slette oppgaven. Prøv igjen senere.');
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Laster...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="mb-4">Delte Oppgaver</h1>

            {/* Statistikk-kort */}
            <Row className="mb-4">
                <Col sm={6} md={3}>
                    <div className="bg-light p-3 rounded">
                        <h6>Totalt Delt</h6>
                        <h3>{stats.totalShared}</h3>
                    </div>
                </Col>
                <Col sm={6} md={3}>
                    <div className="bg-success bg-opacity-10 p-3 rounded">
                        <h6>Fullført</h6>
                        <h3>{stats.completed}</h3>
                    </div>
                </Col>
                <Col sm={6} md={3}>
                    <div className="bg-warning bg-opacity-10 p-3 rounded">
                        <h6>Ventende</h6>
                        <h3>{stats.pending}</h3>
                    </div>
                </Col>
                <Col sm={6} md={3}>
                    <div className="bg-danger bg-opacity-10 p-3 rounded">
                        <h6>Forfalt</h6>
                        <h3>{stats.overdue}</h3>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {sharedTodos.length === 0 ? (
                <Alert variant="info">
                    Ingen delte oppgaver funnet. Når noen deler en oppgave med deg, vil den vises her.
                </Alert>
            ) : (
                <Row className="g-4">
                    {sharedTodos.map((todo) => (
                        <Col key={todo.id} xs={12} md={6} lg={4}>
                            <TodoCard
                                todo={todo}
                                onUpdate={(updatedData) => handleUpdate(todo.id, updatedData)}
                                onDelete={() => handleDelete(todo.id)}
                                isShared={true}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default SharedTodosPage;