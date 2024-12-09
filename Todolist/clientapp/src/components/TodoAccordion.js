// components/TodoAccordion.jsx
import React from 'react';
import { Accordion, Alert } from 'react-bootstrap';
import TodoItem from './TodoItem';
import TimeCounter from './TimeCounter';

const TodoAccordion = ({ todos, onEdit, onDelete, onToggleComplete }) => {
    return (
        <Accordion defaultActiveKey="0">
            {todos.length === 0 ? (
                <Alert variant="info">Ingen oppgaver tilgjengelig. Legg til din første oppgave!</Alert>
            ) : (
                todos.map(todo => (
                    <Accordion.Item
                        eventKey={todo.id.toString()}
                        key={todo.id}
                        className={`todo-accordion-item ${todo.isCompleted ? 'completed' : ''}`}
                    >
                        <Accordion.Header>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="todo-header-content">
                                    <strong className={todo.isCompleted ? 'text-muted' : ''}>
                                        {todo.title}
                                    </strong>
                                    <div className="todo-meta">
                                        <span className="todo-category">{todo.category}</span>
                                        <TimeCounter dueDateTime={todo.dueDateTime} />
                                    </div>
                                </div>
                                <div className="todo-status">
                                    {todo.isCompleted && <span className="completed-badge">Fullført</span>}
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <TodoItem
                                todo={todo}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleComplete={onToggleComplete}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                ))
            )}
        </Accordion>
    );
};

export default TodoAccordion;
