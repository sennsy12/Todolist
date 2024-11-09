import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaCheck, FaEdit, FaTrash, FaClock, FaTag, FaExclamationCircle } from 'react-icons/fa';


const formatDateTime = (dueDateTime) => {
    if (!dueDateTime) return 'Ingen forfallsdato';
    const dateTime = new Date(dueDateTime);
    const date = dateTime.toLocaleDateString('no-NO');  
    const time = dateTime.toTimeString().split(' ')[0].substring(0, 5);  
    return `${date} ${time}`;
};


const priorityColors = {
    'Lav': 'info',
    'Medium': 'warning',
    'Høy': 'danger'
};

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <Card.Title className={`${todo.isCompleted ? 'text-muted text-decoration-line-through' : 'fw-bold'}`}>
                            {todo.title}
                        </Card.Title>
                        <Card.Text className="text-secondary mb-2">
                            {todo.description}
                        </Card.Text>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <Badge bg="secondary" className="d-flex align-items-center">
                                <FaTag className="me-1" /> {todo.category || 'Ingen kategori'}
                            </Badge>
                            <Badge bg="light" text="dark" className="d-flex align-items-center">
                                <FaClock className="me-1" /> {formatDateTime(todo.dueDateTime)}
                            </Badge>
                            <Badge bg={priorityColors[todo.priority]} className="d-flex align-items-center">
                                <FaExclamationCircle className="me-1" /> {todo.priority}
                            </Badge>
                        </div>
                    </div>
                    <Badge bg={todo.isCompleted ? 'success' : 'warning'} className="ms-2">
                        {todo.isCompleted ? 'Fullført' : 'Pågående'}
                    </Badge>
                </div>

                <div className="d-flex gap-2 mt-3">
                    <Button variant={todo.isCompleted ? "outline-secondary" : "outline-success"} size="sm" onClick={() => onToggleComplete(todo)}>
                        <FaCheck className="me-1" />
                        {todo.isCompleted ? 'Gjenåpne' : 'Fullfør'}
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => onEdit(todo)}>
                        <FaEdit className="me-1" />
                        Rediger
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(todo.id)}>
                        <FaTrash className="me-1" />
                        Slett
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TodoItem;