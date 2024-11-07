import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoList = () => {
const [todos, setTodos] = useState([]);
const [newTodo, setNewTodo] = useState({ title: '', description: '' });
const [editingTodo, setEditingTodo] = useState(null);
const [showModal, setShowModal] = useState(false);
const [addingTodoLoading, setAddingTodoLoading] = useState(false);
const [editingTodoLoading, setEditingTodoLoading] = useState(false);


useEffect(() => {
    fetchTodos();
}, []);

const fetchTodos = async () => {
    try
    {
        const response = await fetch('http://localhost:5121/Todo/api/');
        const data = await response.json();
        setTodos(data); 
    }
    catch (error)
    {
        console.error('Error fetching todos:', error);
    }
};

const handleAddTodo = async (e) => {
e.preventDefault();
setAddingTodoLoading(true);
try
{
    const response = await fetch('http://localhost:5121/Todo/api/todo', {
    method: 'POST',
        headers:
        {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
const data = await response.json();
setTodos([...todos, data]); 
setNewTodo({ title: '', description: '' });
    } catch (error) {
    console.error('Error adding todo:', error);
} finally {
    setAddingTodoLoading(false);
}
  };


const handleEditTodo = (todo) => {
    setEditingTodo(todo); 
    setShowModal(true); 
};

const handleSaveEdit = async (e) => {
e.preventDefault();
setEditingTodoLoading(true);
try
{
    const response = await fetch(`http://localhost:5121/todo/${editingTodo.id}`, {
      method: 'PUT',
      headers:
{
    'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingTodo),
    });


if (!response.ok)
{
    throw new Error(`HTTP error! status: ${ response.status }`);
}


setTodos(todos.map((todo) => (todo.id === editingTodo.id ? editingTodo : todo)));


setEditingTodo(null);
setShowModal(false); 
  } catch (error) {
    console.error('Error saving todo:', error);
} finally {
    setEditingTodoLoading(false); 
}
};

const handleDeleteTodo = async (id) => {
try
{
    await fetch(`http://localhost:5121/todo/${id}`, {
      method: 'DELETE',
      });


setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
    console.error('Error deleting todo:', error);
}
  };

return (

  < Container className = "mt-5" >

    < Row className = "justify-content-center" >

      < Col md ={ 8}>

        < h1 className = "text-center mb-4" > Todo List </ h1 >


          < Row >
            {
    todos.map((todo) => (
              < Col sm ={ 4}
    key ={ todo.id}
    className = "mb-4" >
                < Card >
                  < Card.Body >
                    < Card.Title >{ todo.title}</ Card.Title >
                    < Card.Text >{ todo.description}</ Card.Text >
                    < Card.Text >
                      < small className = "text-muted" > Completed: { todo.isCompleted ? 'Yes' : 'No'}</ small >
                    </ Card.Text >
                    < Button variant = "primary" onClick ={ () => handleEditTodo(todo)}
    className = "me-2" >
                      Edit
                    </ Button >
                    < Button variant = "danger" onClick ={ () => handleDeleteTodo(todo.id)}>
                      Delete
                    </ Button >
                  </ Card.Body >
                </ Card >
              </ Col >
            ))}
          </ Row >

          < h2 className = "mt-5" > Add New Todo</h2>
          <Form onSubmit ={handleAddTodo} className = "mb-4" >
            < Form.Group className = "mb-3" controlId = "todoTitle" >
              < Form.Label > Title </ Form.Label >
              < Form.Control
                type = "text"
                value ={ newTodo.title}
onChange ={ (e) => setNewTodo({ ...newTodo, title: e.target.value })}
required
/>

</ Form.Group >

< Form.Group className = "mb-3" controlId = "todoDescription" >

< Form.Label > Description </ Form.Label >

< Form.Control
as= "textarea"
                rows ={ 3}
value ={ newTodo.description}
onChange ={ (e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
            </ Form.Group >

            < Button variant = "success" type = "submit" disabled ={ addingTodoLoading}>
              { addingTodoLoading ? < Spinner animation = "border" size = "sm" /> : 'Add Todo'}
            </ Button >
          </ Form >
{
    editingTodo && (

  < Modal show ={ showModal}
    onHide ={ () => setShowModal(false)}>

    < Modal.Header closeButton >

      < Modal.Title > Edit Todo </ Modal.Title >

    </ Modal.Header >

    < Modal.Body >

      < Form onSubmit ={ handleSaveEdit}>

        < Form.Group className = "mb-3" controlId = "editTodoTitle" >

          < Form.Label > Title </ Form.Label >

          < Form.Control
                      type = "text"
                      value ={ editingTodo.title}
    onChange ={ (e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
    required
  />

</ Form.Group >

< Form.Group className = "mb-3" controlId = "editTodoDescription" >

  < Form.Label > Description </ Form.Label >

  < Form.Control
    as= "textarea"
                      rows ={ 3}
    value ={ editingTodo.description}
    onChange ={ (e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                    />
                  </ Form.Group >
                  < Button variant = "primary" type = "submit" disabled ={ editingTodoLoading}>
                    { editingTodoLoading ? < Spinner animation = "border" size = "sm" /> : 'Save Changes'}
                  </ Button >
                  < Button variant = "secondary" onClick ={ () => setShowModal(false)}
    className = "ms-2" >
                    Cancel
                  </ Button >
                </ Form >
              </ Modal.Body >
            </ Modal >
          )}
        </ Col >
      </ Row >
    </ Container >
  );
};

export default TodoList;