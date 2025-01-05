import { axiosInstance } from '../config/axiosConfig';


export const fetchTodos = async () => {
    try {
        const response = await axiosInstance.get('/todos/user-todos');
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const addTodo = async (newTodo) => {
    try {
        const response = await axiosInstance.post('/todos/create', newTodo);
        return response.data;
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
};

export const updateTodo = async (todo) => {
    try {
        const response = await axiosInstance.put(`/todos/update/${todo.id}`, todo);
        return response.data;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id) => {
    try {
        await axiosInstance.delete(`/todos/delete/${id}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
