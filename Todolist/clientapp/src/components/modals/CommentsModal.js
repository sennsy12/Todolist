import React, { useEffect } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';

const CommentsModal = ({
    show,
    onHide,
    comments,
    newComment,
    setNewComment,
    handleAddComment,
    loading
}) => {

    useEffect(() => {
        if (show) {
            const container = document.querySelector('.comments-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [show, comments]);
    return (
        <Modal show={show} onHide={onHide}>
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
                    <Button variant="primary" onClick={handleAddComment} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Legg til kommentar'}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CommentsModal;