import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaUsers, FaUserPlus, FaUserMinus, FaEdit, FaTrash } from 'react-icons/fa';

const SharedTodoList = ({ list, onAddCollaborator, onRemoveCollaborator, onUpdateRole, onUpdate, onDelete }) => {
    const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCollaborator, setNewCollaborator] = useState({ username: '', role: 'Viewer' });
    const [editData, setEditData] = useState(null);

    const collaborators = list?.collaborators || [];

    const handleAddCollaborator = (e) => {
        e.preventDefault();
        onAddCollaborator(list.id, newCollaborator);
        setShowCollaboratorModal(false);
        setNewCollaborator({ username: '', role: 'Viewer' });
    };

    const handleEdit = () => {
        setEditData({
            title: list.title,
            description: list.description,
            category: list.category,
            priority: list.priority,
            dueDateTime: list.dueDateTime
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate(list.id, editData);
        setShowEditModal(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await onUpdateRole(list.id, userId, newRole);
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Admin': return 'danger';
            case 'Editor': return 'warning';
            case 'Viewer': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <Card.Title>{list?.title}</Card.Title>
                        <Card.Text>{list?.description}</Card.Text>
                        <div className="mb-2">
                            {list?.category && <Badge bg="secondary" className="me-2">{list.category}</Badge>}
                            {list?.priority && <Badge bg="info" className="me-2">{list.priority}</Badge>}
                            {list?.dueDateTime && (
                                <Badge bg="warning">Due: {new Date(list.dueDateTime).toLocaleString()}</Badge>
                            )}
                        </div>
                    </div>
                    <div>
                        <Badge bg={list?.isCompleted ? "success" : "warning"} className="mb-2 d-block">
                            {list?.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                        <Badge bg="primary">
                            <FaUsers className="me-1" />
                            {collaborators.length} Collaborators
                        </Badge>
                    </div>
                </div>

                <div className="mb-3">
                    <Badge bg="info" className="me-2">Owner: {list?.owner?.username}</Badge>
                    <Badge bg="secondary">Created: {list?.createdAt && new Date(list.createdAt).toLocaleDateString()}</Badge>
                </div>

                <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={handleEdit}>
                        <FaEdit className="me-1" /> Edit List
                    </Button>
                    <Button variant="outline-danger" onClick={() => onDelete(list.id)}>
                        <FaTrash className="me-1" /> Delete List
                    </Button>
                    <Button variant="outline-success" onClick={() => setShowCollaboratorModal(true)}>
                        <FaUserPlus className="me-1" /> Add Collaborator
                    </Button>
                </div>

                {collaborators.length > 0 && (
                    <div className="mt-3">
                        <h6>Collaborators:</h6>
                        {collaborators.map(collab => (
                            <div key={collab.userId} className="d-flex align-items-center gap-2 mb-2">
                                <Badge bg={getRoleBadgeColor(collab.role)}>
                                    {collab.user?.username}
                                </Badge>
                                <Form.Select
                                    size="sm"
                                    style={{ width: 'auto' }}
                                    value={collab.role}
                                    onChange={(e) => handleRoleChange(collab.userId, e.target.value)}
                                >
                                    <option value="Viewer">Viewer</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Admin">Admin</option>
                                </Form.Select>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => onRemoveCollaborator(list.id, collab.userId)}
                                >
                                    <FaUserMinus />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card.Body>

            <Modal show={showCollaboratorModal} onHide={() => setShowCollaboratorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Collaborator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddCollaborator}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCollaborator.username}
                                onChange={(e) => setNewCollaborator({ ...newCollaborator, username: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={newCollaborator.role}
                                onChange={(e) => setNewCollaborator({ ...newCollaborator, role: e.target.value })}
                            >
                                <option value="Viewer">Viewer</option>
                                <option value="Editor">Editor</option>
                                <option value="Admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit">Add Collaborator</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData?.title || ''}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={editData?.description || ''}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData?.category || ''}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                value={editData?.priority || 'Low'}
                                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={editData?.dueDateTime ? new Date(editData.dueDateTime).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setEditData({ ...editData, dueDateTime: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit">Update List</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Card>
    );
};

export default SharedTodoList;
