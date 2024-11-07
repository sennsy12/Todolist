// components/TodoItem.js
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

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