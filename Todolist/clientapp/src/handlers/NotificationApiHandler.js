const BASE_URL = 'http://localhost:5121/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
};

export const fetchNotifications = async () => {
    try {
        const response = await fetch(`${BASE_URL}/notifications`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};