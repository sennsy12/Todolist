import { axiosInstance } from '../config/axiosConfig';


export const fetchNotifications = async () => {
    try {
        const response = await axiosInstance.get('/notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        await axiosInstance.put(`/notifications/${notificationId}/read`);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};
