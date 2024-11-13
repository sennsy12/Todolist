import axios from 'axios';

const API_URL = 'http://localhost:5121/api/passwordreset';

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`http://localhost:5121/api/passwordreset/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
};

export const resetPassword = async (email, token, newPassword) => {
    try {
        const response = await axios.post(`http://localhost:5121/api/passwordreset/reset-password`, {
            email,
            token,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
};
