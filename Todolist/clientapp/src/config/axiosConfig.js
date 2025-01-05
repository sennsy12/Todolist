import axios from 'axios';

export const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://todolist-backend-app.azurewebsites.net/api'
    : 'http://localhost:5121/api';

const axiosInstance = axios.create({
    baseURL: API_URL
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const customError = {
            message: error.response?.data?.message || 'An unexpected error occurred',
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        };

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(customError);
    }
);

export { axiosInstance };
