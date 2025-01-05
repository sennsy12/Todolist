import { axiosInstance } from '../config/axiosConfig';


// Todo handlers
export const fetchTodos = async () => {
    try {
        const response = await axiosInstance.get('/todos/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const createTodo = async (todoData) => {
    try {
        const response = await axiosInstance.post('/todos/create', todoData);
        return response.data;
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
        const response = await axiosInstance.put(`/todos/update/${todoId}`, {
            title: todoData.title,
            description: todoData.description,
            isCompleted: todoData.isCompleted || false,
            category: todoData.category,
            dueDateTime: todoData.dueDateTime,
            priority: todoData.priority
        });
        return response.data;
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
        await axiosInstance.delete(`/todos/delete/${todoId}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

// Collaborator handlers
export const addCollaborator = async (todoId, username) => {
    try {
        const response = await axiosInstance.post(`/collaborators/${todoId}/add`, { username });
        return response.data;
    } catch (error) {
        console.error('Error adding collaborator:', error);
        throw error;
    }
};

export const removeCollaborator = async (todoId, username) => {
    try {
        await axiosInstance.delete(`/collaborators/remove/${username}?todoId=${todoId}`);
    } catch (error) {
        console.error('Feil ved fjerning av samarbeidspartner:', error);
        throw error;
    }
};

export const fetchSharedTodos = async () => {
    try {
        const response = await axiosInstance.get('/todos/shared');
        return response.data;
    } catch (error) {
        console.error('Error fetching shared todos:', error);
        throw error;
    }
};

// SubTodo handlers
export const addSubTodo = async (todoId, text) => {
    try {
        const response = await axiosInstance.post(`/todos/${todoId}/subtodos`, { text });
        return response.data;
    } catch (error) {
        console.error('Error adding sub-todo:', error);
        throw error;
    }
};

export const updateSubTodo = async (todoId, subTodoId, updates) => {
    try {
        const response = await axiosInstance.put(`/todos/${todoId}/subtodos/${subTodoId}`, {
            text: updates.text || '',
            isCompleted: updates.isCompleted
        });
        return response.data;
    } catch (error) {
        console.error('Error updating sub-todo:', error);
        throw error;
    }
};

export const deleteSubTodo = async (todoId, subTodoId) => {
    try {
        await axiosInstance.delete(`/todos/${todoId}/subtodos/${subTodoId}`);
    } catch (error) {
        console.error('Error deleting sub-todo:', error);
        throw error;
    }
};

// Comment handlers
export const addComment = async (todoId, text) => {
    try {
        const response = await axiosInstance.post(`/todos/${todoId}/comments`, { text });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const fetchComments = async (todoId) => {
    try {
        const response = await axiosInstance.get(`/todos/${todoId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const deleteComment = async (todoId, commentId) => {
    try {
        await axiosInstance.delete(`/todos/${todoId}/comments/${commentId}`);
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
