import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Form, Modal, ListGroup, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import TodoForm from './TodoForm';
import TimeCounter from './TimeCounter';
import { format } from 'date-fns/format';
import {
    updateTodo,
    deleteTodo,
    addCollaborator,
    removeCollaborator,
    addSubTodo,
    updateSubTodo,
    deleteSubTodo,
    addComment,
    fetchComments
} from '../handlers/todoApiHandlers';

const TodoCard = ({ todo, onUpdate, onDelete, onAddSubTodo, onUpdateSubTodo, onDeleteSubTodo, onRefresh }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [newCollaborator, setNewCollaborator] = useState('');
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [newSubTodo, setNewSubTodo] = useState('');
    const [showSubTodos, setShowSubTodos] = useState(true);
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleDelete = async () => {
        if (window.confirm('Er du sikker på at du vil slette denne oppgaven?')) {
            try {
                await deleteTodo(todo.id);
                if (onRefresh) {
                    await onRefresh();
                }
            } catch (error) {
                console.error('Error deleting todo:', error);
            }
        }
    };



    const handleAddCollaborator = async () => {
        if (!newCollaborator.trim()) {
            setFeedbackMessage('Vennligst skriv inn et gyldig brukernavn.');
            setTimeout(() => setFeedbackMessage(''), 3000);
            return;
        }

        try {
            setLoading(true);
            await addCollaborator(todo.id, newCollaborator);
            const updatedTodo = {
                ...todo,
                collaborators: [...(todo.collaborators || []), newCollaborator]
            };

            setNewCollaborator('');
            setFeedbackMessage('Samarbeidspartner ble lagt til!');
            onUpdate(updatedTodo);
        } catch (error) {
            console.error('Error adding collaborator:', error);
            setFeedbackMessage('Kunne ikke legge til samarbeidspartner. Prøv igjen senere.');
        } finally {
            setLoading(false);
            setTimeout(() => setFeedbackMessage(''), 3000);
        }
    }; 

    const handleRemoveCollaborator = async (username) => {
        try {
            await removeCollaborator(todo.id, username);
            if (onRefresh) {
                await onRefresh();
            } else {
                const updatedTodo = {
                    ...todo,
                    collaboratorUsernames: todo.collaboratorUsernames.filter(u => u !== username)
                };
                onUpdate(updatedTodo);
            }
            setFeedbackMessage('Samarbeidspartner ble fjernet');
        } catch (error) {
            console.error('Feil ved fjerning av samarbeidspartner:', error);
            setFeedbackMessage('Kunne ikke fjerne samarbeidspartner');
        }
    };

    const handleAddSubTodo = async () => {
        if (!newSubTodo.trim()) return;
        try {
            setLoading(true);
            await onAddSubTodo(newSubTodo);
            setNewSubTodo('');
            if (onRefresh) onRefresh(); 
        } catch (error) {
            console.error('Error adding sub-todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubTodo = async (subTodoId) => {
        try {
            await deleteSubTodo(todo.id, subTodoId);
            const updatedTodo = {
                ...todo,
                subTodos: todo.subTodos.filter(st => st.id !== subTodoId)
            };
            onUpdate(updatedTodo);
        } catch (error) {
            console.error('Error deleting sub-todo:', error);
        }
    };

    const handleToggleSubTodo = async (subTodoId, isCompleted) => {
        try {
            const existingSubTodo = todo.subTodos.find(st => st.id === subTodoId);

            // Kall eksisterende UpdateSubTaskAsync endpoint
            const updatedSubTodo = await updateSubTodo(todo.id, subTodoId, {
                text: existingSubTodo.text,
                isCompleted: !isCompleted
            });

            // Oppdater UI med responsen fra serveren
            const updatedTodo = {
                ...todo,
                subTodos: todo.subTodos.map(st =>
                    st.id === subTodoId ? updatedSubTodo : st
                )
            };

            onUpdate(updatedTodo);
        } catch (error) {
            console.error('Feil ved oppdatering av deloppgave:', error);
        }
    };


    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            setLoading(true);
            await addComment(todo.id, newComment);
            setNewComment('');
            await loadComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const data = await fetchComments(todo.id);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleUpdateTodo = async (updatedData) => {
        try {
            if (!todo.id) {
                throw new Error('Todo ID is missing');
            }

            const todoData = {
                ...updatedData,
                id: todo.id  
            };

            await onUpdate(todoData);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High':
                return { emoji: '🔥', text: 'Høy prioritet', variant: 'danger' };
            case 'Medium':
                return { emoji: '⚡', text: 'Middels prioritet', variant: 'warning' };
            case 'Low':
                return { emoji: '🌱', text: 'Lav prioritet', variant: 'success' };
            default:
                return { emoji: '⭐', text: 'Prioritet', variant: 'info' };
        }
    };

    const getCategoryEmoji = (category) => {
        switch (category?.toLowerCase()) {
            case 'arbeid':
                return '💼';
            case 'personlig':
                return '🏠';
            case 'studie':
                return '📚';
            case 'trening':
                return '🏃';
            case 'møte':
                return '👥';
            default:
                return '📌';
        }
    };


    useEffect(() => {
        if (showCommentsModal) {
            loadComments();
        }
    }, [showCommentsModal]);

    return (
        <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <Badge
                            bg={todo.priority === 'High' ? 'danger' : todo.priority === 'Medium' ? 'warning' : 'success'}
                            className="px-3 py-2 rounded-pill d-flex align-items-center gap-1"
                        >
                            <span>{todo.priority === 'High' ? '🔥' : todo.priority === 'Medium' ? '⚡' : '🌱'}</span>
                            <span>{todo.priority === 'High' ? 'Høy' : todo.priority === 'Medium' ? 'Middels' : 'Lav'}</span>
                        </Badge>

                        <Badge
                            bg="light"
                            text="dark"
                            className="px-3 py-2 rounded-pill d-flex align-items-center gap-1"
                        >
                            {todo.category && (
                                <>
                                    <span>
                                        {todo.category.toLowerCase() === 'arbeid' ? '💼' :
                                            todo.category.toLowerCase() === 'personlig' ? '🏠' :
                                                todo.category.toLowerCase() === 'studie' ? '📚' :
                                                    todo.category.toLowerCase() === 'trening' ? '🏃' :
                                                        todo.category.toLowerCase() === 'møte' ? '👥' : '📌'}
                                    </span>
                                    <span>{todo.category}</span>
                                </>
                            )}
                        </Badge>
                    </div>

                    {todo.dueDateTime && (
                        <TimeCounter dueDateTime={todo.dueDateTime} />
                    )}
                </div>

                <div>
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="p-0" style={{ color: '#6c757d' }}>
                            <ThreeDotsVertical size={20} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setShowEditModal(true)}>
                                Rediger
                            </Dropdown.Item>
                            <Dropdown.Item className="text-danger" onClick={handleDelete}>
                                Slett
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Card.Header>

            <Card.Body>
                <Card.Title>{todo.title}</Card.Title>
                <Card.Text>{todo.description}</Card.Text>

                {todo.dueDateTime && (
                    <div className="mb-3 text-muted">
                        <small>
                            Frist: {format(new Date(todo.dueDateTime), 'dd.MM.yyyy HH:mm')}
                        </small>
                    </div>
                )}

                {/* Collaborators Section */}
                <div className="mb-3">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowCollaboratorModal(true)}
                        className="me-2"
                    >
                        Del oppgave
                    </Button>
                    <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => setShowCommentsModal(true)}
                    >
                        Kommentarer
                    </Button>
                </div>

                {/* Sub-todos Section */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Deloppgaver</h6>
                        <Button
                            variant="link"
                            onClick={() => setShowSubTodos(!showSubTodos)}
                            className="p-0"
                        >
                            {showSubTodos ? 'Skjul' : 'Vis'}
                        </Button>
                    </div>

                    {showSubTodos && (
                        <>
                            <ListGroup className="mb-2">
                                {todo.subTodos?.map((subTodo) => (
                                    <ListGroup.Item
                                        key={subTodo.id}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <Form.Check
                                            type="checkbox"
                                            checked={subTodo.isCompleted}
                                            onChange={() => handleToggleSubTodo(subTodo.id, subTodo.isCompleted)}
                                            label={subTodo.text}
                                            className={subTodo.isCompleted ? 'text-muted' : ''}
                                        />
                                        <Button
                                            variant="link"
                                            className="text-danger p-0"
                                            onClick={() => handleDeleteSubTodo(subTodo.id)}
                                        >
                                            Slett
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    value={newSubTodo}
                                    onChange={(e) => setNewSubTodo(e.target.value)}
                                    placeholder="Legg til deloppgave..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSubTodo();
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleAddSubTodo}
                                    disabled={loading}
                                >
                                    Legg til
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Card.Body>

            {/* Collaborator Modal */}
            <Modal show={showCollaboratorModal} onHide={() => setShowCollaboratorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Del oppgave</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Legg til samarbeidspartner</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                value={newCollaborator}
                                onChange={(e) => setNewCollaborator(e.target.value)}
                                placeholder="Skriv inn brukernavn"
                            />
                            <Button
                                variant="primary"
                                onClick={handleAddCollaborator}
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Legg til'}
                            </Button>
                        </div>
                    </Form.Group>

                    {feedbackMessage && (
                        <div className="mt-3">
                            <Alert variant="success">{feedbackMessage}</Alert>
                        </div>
                    )}

                    {todo.collaboratorUsernames?.length > 0 && (
                        <div>
                            <h6>Delt med:</h6>
                            <ListGroup>
                                {todo.collaboratorUsernames.map((collaborator) => (
                                    <ListGroup.Item
                                        key={collaborator}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        {collaborator}
                                        <Button
                                            variant="link"
                                            className="text-danger p-0"
                                            onClick={() => handleRemoveCollaborator(collaborator)}
                                        >
                                            Fjern
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* TodoForm Modal */}
            <TodoForm
                initialTodo={todo}
                onSubmit={handleUpdateTodo}
                loading={loading}
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
            />
          

            {/* Comments Modal */}
            <Modal show={showCommentsModal} onHide={() => setShowCommentsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Kommentarer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="comments-container mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {comments.map((comment) => (
                            <div key={comment.id} className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex justify-content-between">
                                    <strong>{comment.username}</strong>
                                    <small className="text-muted">
                                        {format(new Date(comment.createdAt), 'dd.MM.yyyy HH:mm')}
                                    </small>
                                </div>
                                <p className="mb-0 mt-2">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Skriv en kommentar..."
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                        <Button
                            variant="primary"
                            onClick={handleAddComment}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Legg til kommentar'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Card>
    );
};

export default TodoCard;