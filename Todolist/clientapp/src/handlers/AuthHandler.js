import { axiosInstance } from '../config/axiosConfig';


export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/register', {
            username: credentials.username,
            email: credentials.email,
            password: credentials.password
        });
        return response.data;
    } catch (error) {
        console.error('Registreringsfeil:', error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};
