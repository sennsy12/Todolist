import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const formatDate = (dateString) => {
    if (!dateString) return 'Ingen';

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('no-NO', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${formattedDate}, ${formattedTime}`;
};

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <div>
                        <Card.Title className={todo.isCompleted ? 'text-muted' : ''}>
                            {todo.title}
                        </Card.Title>
                        <Card.Text className="text-secondary">
                            {todo.description}
                        </Card.Text>
                        <Card.Text className="text-muted">
                            <strong>Kategori:</strong> {todo.category || 'Ingen'}
                        </Card.Text>
                        <Card.Text className="text-muted">
                            <strong>Forfallsdato:</strong> {formatDate(todo.dueDate)}
                        </Card.Text>
                        <Card.Text className="text-muted">
                            <strong>Prioritet:</strong> {todo.priority}
                        </Card.Text>
                    </div>
                    <Badge bg={todo.isCompleted ? 'success' : 'warning'}>
                        {todo.isCompleted ? 'Fullført' : 'Pågående'}
                    </Badge>
                </div>
                <div className="d-flex gap-2 mt-3">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onToggleComplete(todo)}
                    >
                        {todo.isCompleted ? 'Merk som ikke fullført' : 'Merk som fullført'}
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => onEdit(todo)}
                    >
                        Rediger
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(todo.id)}
                    >
                        Slett
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TodoItem;