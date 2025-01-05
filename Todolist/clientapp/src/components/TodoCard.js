    import React, { useState, useEffect } from 'react';
    import { Card, Button, Badge, Dropdown, } from 'react-bootstrap';
    import { ThreeDotsVertical, ClockFill, PeopleFill, ChatDotsFill, ListTask,  } from 'react-bootstrap-icons';
    import TodoForm from './TodoForm';
    import CollaboratorModal from './modals/CollaboratorModal';
    import CommentsModal from './modals/CommentsModal';
    import SubTodoModal from './modals/SubTodoModal';
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

    const TodoCard = ({ todo, onUpdate, onRefresh }) => {
        const [showSubTodoModal, setShowSubTodoModal] = useState(false);
        const [showEditModal, setShowEditModal] = useState(false);
        const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
        const [showCommentsModal, setShowCommentsModal] = useState(false);
        const [newCollaborator, setNewCollaborator] = useState('');
        const [newComment, setNewComment] = useState('');
        const [comments, setComments] = useState([]);
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

        const handleAddSubTodo = async (todoId, text) => {
            if (!text.trim()) return;
            try {
                setLoading(true);
                await addSubTodo(todo.id, text);
                if (onRefresh) await onRefresh();
            } catch (error) {
                console.error('Feil ved opprettelse av deloppgave:', error);
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

                const updatedSubTodo = await updateSubTodo(todo.id, subTodoId, {
                    text: existingSubTodo.text,
                    isCompleted: !isCompleted
                });

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
                            <div className="d-flex justify-content-between align-items-center mb-3">
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
        <Button variant="outline-secondary" size="sm" onClick={() => setShowSubTodoModal(true)}>
            <ListTask />
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
                        </div>
                    </Card.Body>
                </Card>

            {/* Subtodo Modal */}
                <SubTodoModal
        show={showSubTodoModal}
        onHide={() => setShowSubTodoModal(false)}
        todo={todo}
        onAddSubTodo={handleAddSubTodo}
        onToggleSubTodo={handleToggleSubTodo}
        onDeleteSubTodo={handleDeleteSubTodo}
    />

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