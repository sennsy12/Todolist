import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    addCollaborator,
    removeCollaborator,
    addSubTodo,
    updateSubTodo,
    deleteSubTodo
} from '../handlers/todoApiHandlers';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchTodos();
            setTodos(data);
        } catch (error) {
            console.error('Error loading todos:', error);
            setError('Kunne ikke laste oppgaver. Prøv igjen senere.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTodo = async (todoData) => {
        try {
            setLoading(true);
            const newTodo = await createTodo(todoData);
            setTodos([...todos, newTodo]);
            setShowAddModal(false);
        } catch (error) {
            console.error('Error creating todo:', error);
            setError('Kunne ikke opprette oppgave. Prøv igjen senere.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTodo = async (todoId, updatedData) => {
        try {
            setLoading(true);
            await updateTodo(todoId, updatedData);
            await loadTodos(); // Oppdater listen etter vellykket oppdatering
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Kunne ikke oppdatere oppgaven. Prøv igjen senere.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            await deleteTodo(todoId);
            setTodos(todos.filter(todo => todo.id !== todoId));
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Kunne ikke slette oppgave. Prøv igjen senere.');
        }
    };

    const handleAddCollaborator = async (todoId, username) => {
        try {
            await addCollaborator(todoId, username);
            await loadTodos(); // Oppdater listen for å få med nye collaborators
        } catch (error) {
            console.error('Error adding collaborator:', error);
            setError('Kunne ikke legge til samarbeidspartner. Prøv igjen senere.');
        }
    };

    const handleRemoveCollaborator = async (todoId, username) => {
        try {
            await removeCollaborator(todoId, username);
            await loadTodos();
        } catch (error) {
            console.error('Error removing collaborator:', error);
            setError('Kunne ikke fjerne samarbeidspartner. Prøv igjen senere.');
        }
    };

    const handleAddSubTodo = async (todoId, text) => {
        try {
            await addSubTodo(todoId, text);
            await loadTodos(); // Laster inn todos på nytt etter endring
        } catch (error) {
            console.error('Error adding sub-todo:', error);
            setError('Kunne ikke legge til deloppgave. Prøv igjen senere.');
        }
    };

    const handleUpdateSubTodo = async (todoId, subTodoId, updates) => {
        try {
            await updateSubTodo(todoId, subTodoId, updates);
            await loadTodos();
        } catch (error) {
            console.error('Error updating sub-todo:', error);
            setError('Kunne ikke oppdatere deloppgave. Prøv igjen senere.');
        }
    };

    const handleDeleteSubTodo = async (todoId, subTodoId) => {
        try {
            await deleteSubTodo(todoId, subTodoId);
            await loadTodos();
        } catch (error) {
            console.error('Error deleting sub-todo:', error);
            setError('Kunne ikke slette deloppgave. Prøv igjen senere.');
        }
    };

    if (loading && todos.length === 0) {
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
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mine Oppgaver</h1>
                <Button
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                >
                    Ny Oppgave
                </Button>
            </header>

            {error && (
                <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Row className="g-4">
                {todos.map((todo) => (
                    <Col key={todo.id} xs={12} md={6} lg={4}>
                        <TodoCard
                            todo={todo}
                            onUpdate={(updatedData) => handleUpdateTodo(todo.id, updatedData)}
                            onDelete={(id) => handleDeleteTodo(id)}
                            onAddCollaborator={(username) => handleAddCollaborator(todo.id, username)}
                            onRemoveCollaborator={(username) => handleRemoveCollaborator(todo.id, username)}
                            onAddSubTodo={(text) => handleAddSubTodo(todo.id, text)}
                            onUpdateSubTodo={(subTodoId, updates) => handleUpdateSubTodo(todo.id, subTodoId, updates)}
                            onDeleteSubTodo={(subTodoId) => handleDeleteSubTodo(todo.id, subTodoId)}
                            onRefresh={loadTodos}
                        />
                    </Col>
                ))}

                {todos.length === 0 && !loading && (
                    <Col xs={12}>
                        <Alert variant="info">
                            Ingen oppgaver funnet. Opprett en ny oppgave for å komme i gang.
                        </Alert>
                    </Col>
                )}
            </Row>

            <TodoForm
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSubmit={handleCreateTodo}
                loading={loading}
            />
        </Container>
    );
};

export default TodoList;