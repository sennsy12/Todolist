import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Form, Modal, ListGroup, Spinner, Alert, Dropdown, InputGroup } from 'react-bootstrap';
import { ThreeDotsVertical, ClockFill, PeopleFill, ChatDotsFill, TrashFill, ChevronDown, ChevronUp, PlusLg  } from 'react-bootstrap-icons';
import TodoForm from './TodoForm';
import CollaboratorModal from './modals/CollaboratorModal';
import CommentsModal from './modals/CommentsModal';
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
    const [showSubTodos, setShowSubTodos] = useState(false);
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
            if (username === todo.ownerUsername) {
                setFeedbackMessage('Kan ikke fjerne eieren av oppgaven');
                setTimeout(() => setFeedbackMessage(''), 3000);
                return;
            }

            await removeCollaborator(todo.id, username);
            if (onRefresh) {
                await onRefresh();
            }
        } catch (error) {
            console.error('Feil ved fjerning av samarbeidspartner:', error);
            setFeedbackMessage(error.message || 'Kunne ikke fjerne samarbeidspartner');
            setTimeout(() => setFeedbackMessage(''), 3000);
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
        <>
            <Card className="border-0 rounded-lg shadow-lg mb-4 overflow-hidden">
                <Card.Body className="p-0">
                    <div className="bg-gradient-primary p-4 text-black">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h3 className="mb-0">{todo.title}</h3>
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="text-black p-0">
                                    <ThreeDotsVertical size={16} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setShowEditModal(true)}>Rediger</Dropdown.Item>
                                    <Dropdown.Item className="text-danger" onClick={handleDelete}>Slett</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <p className="mb-0">{todo.description}</p>
                    </div>

                    <div className="p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
            <Badge
                bg={todo.priority === 'High' ? 'danger' : todo.priority === 'Medium' ? 'warning' : 'success'}
                className="rounded-pill px-3 py-2"
            >
                {todo.priority === 'High' ? '🔥 Høy' : todo.priority === 'Medium' ? '⚡ Middels' : '🌱 Lav'}
            </Badge>

            {todo.category && (
                <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    {todo.category.toLowerCase() === 'arbeid' ? '💼' :
                        todo.category.toLowerCase() === 'personlig' ? '🏠' :
                            todo.category.toLowerCase() === 'studie' ? '📚' :
                                todo.category.toLowerCase() === 'trening' ? '🏃' :
                                    todo.category.toLowerCase() === 'møte' ? '👥' : '📌'}
                    {' '}{todo.category}
                </Badge>
            )}
        </div>
        
        <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => setShowCollaboratorModal(true)}>
                <PeopleFill />
            </Button>
            <Button variant="outline-info" size="sm" onClick={() => setShowCommentsModal(true)}>
                <ChatDotsFill />
            </Button>
        </div>
    </div>


                        {todo.dueDateTime && (
                            <div className="d-flex align-items-center mb-4">
                                <ClockFill className="text-primary me-2" />
                                <small className="text-muted">
                                    Frist: {format(new Date(todo.dueDateTime), 'dd.MM.yyyy HH:mm')}
                                </small>
                                <div className="ms-auto">
                                    <TimeCounter dueDateTime={todo.dueDateTime} />
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0">Deloppgaver</h6>
                                <Button
                                    variant="link"
                                    onClick={() => setShowSubTodos(!showSubTodos)}
                                    className="p-0"
                                >
                                    {showSubTodos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </Button>
                            </div>

                            {showSubTodos && (
                                <>
                                    <ListGroup variant="flush" className="mb-3">
                                        {todo.subTodos?.map((subTodo) => (
                                            <ListGroup.Item key={subTodo.id} className="d-flex justify-content-between align-items-center px-0 py-2 border-0">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={subTodo.isCompleted}
                                                    onChange={() => handleToggleSubTodo(subTodo.id, subTodo.isCompleted)}
                                                    label={subTodo.text}
                                                    className={`${subTodo.isCompleted ? 'text-muted' : ''} m-0`}
                                                />
                                                <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteSubTodo(subTodo.id)}>
                                                    <TrashFill size={16} />
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
                                        <Button variant="primary" size="sm" onClick={handleAddSubTodo} disabled={loading}>
                                            <PlusLg />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Collaborator Modal */}
            <CollaboratorModal
                show={showCollaboratorModal}
                onHide={() => setShowCollaboratorModal(false)}
                newCollaborator={newCollaborator}
                setNewCollaborator={setNewCollaborator}
                handleAddCollaborator={handleAddCollaborator}
                loading={loading}
                feedbackMessage={feedbackMessage}
                todo={todo}
                handleRemoveCollaborator={handleRemoveCollaborator}
            />

            {/* TodoForm Modal */}
            <TodoForm
                initialTodo={todo}
                onSubmit={handleUpdateTodo}
                loading={loading}
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
            />

            {/* Comments Modal */}
            <CommentsModal
                show={showCommentsModal}
                onHide={() => setShowCommentsModal(false)}
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddComment={handleAddComment}
                loading={loading}
            />
        </>
    );
};

export default TodoCard;