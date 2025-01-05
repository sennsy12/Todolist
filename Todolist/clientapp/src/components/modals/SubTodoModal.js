import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { TrashFill, Plus } from 'react-bootstrap-icons';

const SubTodoModal = ({ 
    show, 
    onHide, 
    todo, 
    onAddSubTodo, 
    onToggleSubTodo, 
    onDeleteSubTodo,
    loading 
}) => {
    const [newSubTodo, setNewSubTodo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newSubTodo.trim() || loading) return;
        
        try {
            await onAddSubTodo(todo.id, newSubTodo);
            setNewSubTodo('');
        } catch (error) {
            console.error('Feil ved opprettelse av deloppgave:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{todo.title} - Deloppgaver</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex">
                    <div className="w-50 pe-4">
                        <Form onSubmit={handleSubmit} className="mb-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Ny deloppgave</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newSubTodo}
                                    onChange={(e) => setNewSubTodo(e.target.value)}
                                    placeholder="Skriv inn deloppgave..."
                                    disabled={loading}
                                />
                            </Form.Group>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-100"
                                disabled={loading}
                            >
                                <Plus /> Legg til deloppgave
                            </Button>
                        </Form>
                    </div>

                    <div className="w-50 ps-4 border-start">
                        <h3 className="mb-4">Deloppgaver</h3>
                        <div className="space-y-4">
                            {todo.subTodos?.map((subTodo) => (
                                <div key={subTodo.id} className="rounded border p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex gap-3 align-items-start">
                                            <div 
                                                className={`mt-1 rounded-circle border border-2 ${
                                                    subTodo.isCompleted 
                                                        ? 'bg-primary border-primary' 
                                                        : 'border-primary'
                                                }`}
                                                onClick={() => onToggleSubTodo(subTodo.id, subTodo.isCompleted)}
                                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            />
                                            <div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`${subTodo.isCompleted ? 'text-decoration-line-through' : ''}`}>
                                                        {subTodo.text}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="link" 
                                            className="text-danger p-0"
                                            onClick={() => onDeleteSubTodo(subTodo.id)}
                                            disabled={loading}
                                        >
                                            <TrashFill />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SubTodoModal;
