import React from 'react';
import { Modal, Form, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { PeopleFill, PersonPlusFill, XCircleFill } from 'react-bootstrap-icons';

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
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="border-0 bg-primary">
                <Modal.Title className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-25 p-2 rounded-3">
                        <PeopleFill className="fs-4" />
                    </div>
                    <span className="ms-3 text-dark">Del oppgave</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Form.Group className="mb-4">
                    <Form.Label className="text-uppercase small fw-bold mb-3">
                        Legg til samarbeidspartner
                    </Form.Label>
                    <div className="bg-light p-3 rounded-3">
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                value={newCollaborator}
                                onChange={(e) => setNewCollaborator(e.target.value)}
                                placeholder="Skriv inn brukernavn"
                                className="border-0 shadow-sm"
                            />
                            <Button
                                variant="primary"
                                onClick={handleAddCollaborator}
                                disabled={loading}
                                className="d-flex align-items-center gap-2"
                            >
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <>
                                        <PersonPlusFill />
                                        Legg til
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Form.Group>

                {feedbackMessage && (
                    <Alert variant="success" className="mb-4 shadow-sm">
                        {feedbackMessage}
                    </Alert>
                )}

                {todo.collaboratorUsernames?.length > 0 && (
                    <div>
                        <h6 className="text-uppercase small fw-bold mb-3">
                            Samarbeidspartnere
                        </h6>
                        <ListGroup variant="flush">
                            {todo.collaboratorUsernames.map((collaborator) => (
                                <ListGroup.Item
                                    key={collaborator}
                                    className="bg-light rounded-3 mb-2 border-0"
                                >
                                    <div className="d-flex justify-content-between align-items-center py-2">
                                        <div className="d-flex align-items-center">
                                            <div className={`rounded-3 p-2 me-3 ${
                                                collaborator === todo.ownerUsername 
                                                ? 'bg-warning bg-opacity-25' 
                                                : 'bg-info bg-opacity-25'
                                            }`}>
                                                {collaborator === todo.ownerUsername ? '👑' : '👤'}
                                            </div>
                                            <span className={collaborator === todo.ownerUsername ? 'fw-bold' : ''}>
                                                {collaborator}
                                            </span>
                                        </div>
                                        {collaborator !== todo.ownerUsername && (
                                            <Button
                                                variant="link"
                                                className="text-danger p-2"
                                                onClick={() => handleRemoveCollaborator(collaborator)}
                                            >
                                                <XCircleFill className="fs-5" />
                                            </Button>
                                        )}
                                    </div>
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