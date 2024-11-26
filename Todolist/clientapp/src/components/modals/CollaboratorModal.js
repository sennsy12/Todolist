import React from 'react';
import { Modal, Form, Button, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';

const CollaboratorModal = ({
    show,
    onHide,
    newCollaborator,
    setNewCollaborator,
    handleAddCollaborator,
    loading,
    feedbackMessage,
    todo,
    handleRemoveCollaborator
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title><PeopleFill className="me-2" />Del oppgave</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Legg til samarbeidspartner</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            value={newCollaborator}
                            onChange={(e) => setNewCollaborator(e.target.value)}
                            placeholder="Skriv inn brukernavn"
                        />
                        <Button
                            variant="outline-primary"
                            onClick={handleAddCollaborator}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Legg til'}
                        </Button>
                    </div>
                </Form.Group>
                {feedbackMessage && (
                    <Alert variant="success" className="mb-4">
                        {feedbackMessage}
                    </Alert>
                )}
                {todo.collaboratorUsernames?.length > 0 && (
                    <div>
                        <h6 className="fw-bold mb-3">Samarbeidspartnere</h6>
                        <ListGroup variant="flush">
                            {todo.collaboratorUsernames.map((collaborator) => (
                                <ListGroup.Item
                                    key={collaborator}
                                    className="d-flex justify-content-between align-items-center py-3"
                                >
                                    <div className="d-flex align-items-center">
                                        <Badge bg={collaborator === todo.ownerUsername ? 'warning' : 'info'} className="me-2">
                                            {collaborator === todo.ownerUsername ? '👑' : '👤'}
                                        </Badge>
                                        <span className={collaborator === todo.ownerUsername ? 'fw-bold' : ''}>
                                            {collaborator}
                                        </span>
                                    </div>
                                    {collaborator !== todo.ownerUsername && (
                                        <Button
                                            variant="link"
                                            className="text-danger p-0"
                                            onClick={() => handleRemoveCollaborator(collaborator)}
                                        >
                                            Fjern
                                        </Button>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CollaboratorModal;