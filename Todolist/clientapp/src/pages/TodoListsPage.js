import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import TodoForm from '../components/TodoForm';
import SharedTodoList from '../components/SharedTodoList';
import {
    fetchUserLists,
    createNewList,
    updateTodoList,
    deleteTodoList,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorRole
} from '../handlers/TodoListHandler';

const TodoListsPage = () => {
    const [lists, setLists] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            setLoading(true);
            const data = await fetchUserLists();
            setLists(data);
        } catch (err) {
            setError('Failed to load lists');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateList = async (listData) => {
        try {
            await createNewList(listData);
            loadLists();
        } catch (err) {
            setError('Failed to create list');
        }
    };

    const handleUpdateList = async (listId, listData) => {
        try {
            await updateTodoList(listId, listData);
            loadLists();
        } catch (err) {
            setError('Failed to update list');
        }
    };

    const handleDeleteList = async (listId) => {
        if (window.confirm('Are you sure you want to delete this list?')) {
            try {
                await deleteTodoList(listId);
                setLists(lists.filter(list => list.id !== listId));
            } catch (err) {
                setError('Failed to delete list');
            }
        }
    };

    const handleAddCollaborator = async (listId, collaboratorData) => {
        try {
            await addCollaborator(listId, collaboratorData);
            loadLists();
        } catch (err) {
            setError('Failed to add collaborator');
        }
    };

    const handleRemoveCollaborator = async (listId, userId) => {
        try {
            await removeCollaborator(listId, userId);
            loadLists();
        } catch (err) {
            setError('Failed to remove collaborator');
        }
    };

    const handleUpdateRole = async (listId, userId, role) => {
        try {
            await updateCollaboratorRole(listId, userId, role);
            loadLists();
        } catch (err) {
            setError('Failed to update role');
        }
    };

    return (
        <Container className="py-4">
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            <Row>
                <Col lg={4}>
                    <h3>Create New Todo List</h3>
                    <TodoForm
                        onSubmit={handleCreateList}
                        loading={loading}
                    />
                </Col>

                <Col lg={8}>
                    <h3>My Todo Lists</h3>
                    {lists.map(list => (
                        <SharedTodoList
                            key={list.id}
                            list={list}
                            onAddCollaborator={handleAddCollaborator}
                            onRemoveCollaborator={handleRemoveCollaborator}
                            onUpdateRole={handleUpdateRole}
                            onUpdate={handleUpdateList}
                            onDelete={handleDeleteList}
                        />
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default TodoListsPage;
