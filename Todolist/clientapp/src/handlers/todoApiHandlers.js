// src/api/todoApiHandlers.js

// Todo handlers
export const fetchTodos = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5121/api/todos/all', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const createTodo = async (todoData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5121/api/todos/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        });

        if (!response.ok) throw new Error('Failed to create todo');
        return await response.json();
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};

export const updateTodo = async (todoId, todoData) => {
    try {
        if (!todoId) {
            throw new Error('Todo ID is required');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/update/${todoId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: todoData.title,
                description: todoData.description,
                isCompleted: todoData.isCompleted || false,
                category: todoData.category,
                dueDateTime: todoData.dueDateTime,
                priority: todoData.priority
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

export const deleteTodo = async (todoId) => {
    try {
        if (!todoId) {
            throw new Error('Todo ID is required');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/delete/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to delete todo');
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

// Collaborator handlers
export const addCollaborator = async (todoId, username) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/collaborators/${todoId}/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            if (response.ok) {
                return { success: true };
            }
            throw new Error('Kunne ikke legge til samarbeidspartner');
        }
    } catch (error) {
        console.error('Error adding collaborator:', error);
        throw error;
    }
};

export const removeCollaborator = async (todoId, username) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/collaborators/remove/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to remove collaborator');
    } catch (error) {
        console.error('Error removing collaborator:', error);
        throw error;
    }
};

export const fetchSharedTodos = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5121/api/todos/shared', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch shared todos');
        return await response.json();
    } catch (error) {
        console.error('Error fetching shared todos:', error);
        throw error;
    }
};

// SubTodo handlers
export const addSubTodo = async (todoId, text) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/subtodos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error('Failed to add sub-todo');
        return await response.json();
    } catch (error) {
        console.error('Error adding sub-todo:', error);
        throw error;
    }
};

export const updateSubTodo = async (todoId, subTodoId, updates) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/subtodos/${subTodoId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: updates.text || '',  
                isCompleted: updates.isCompleted
            })
        });

        if (!response.ok) throw new Error('Failed to update sub-todo');
        return await response.json();
    } catch (error) {
        console.error('Error updating sub-todo:', error);
        throw error;
    }
};

export const deleteSubTodo = async (todoId, subTodoId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/subtodos/${subTodoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete sub-todo');
    } catch (error) {
        console.error('Error deleting sub-todo:', error);
        throw error;
    }
};

// Comment handlers
export const addComment = async (todoId, text) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error('Failed to add comment');
        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const fetchComments = async (todoId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch comments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const deleteComment = async (todoId, commentId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5121/api/todos/${todoId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete comment');
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};