import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Stack } from 'react-bootstrap';
import { BellFill, Circle, CircleFill } from 'react-bootstrap-icons';
import { fetchNotifications, markNotificationAsRead } from '../handlers/NotificationApiHandler';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const getNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            await getNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        getNotifications();
        const interval = setInterval(getNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="nav-link position-relative p-2">
            <BellFill className="text-white" size={16} />
            {unreadCount > 0 && (
                <Badge 
                    bg="danger" 
                    className="position-absolute top-0 start-100 translate-middle rounded-pill"
                >
                    {unreadCount}
                </Badge>
            )}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: '350px', maxHeight: '500px', overflow: 'auto' }}>
            <Dropdown.Header className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Varsler</span>
                {unreadCount > 0 && (
                    <Badge bg="primary">{unreadCount} uleste</Badge>
                )}
            </Dropdown.Header>
            <Dropdown.Divider />

            {notifications.length === 0 ? (
                <Dropdown.ItemText className="text-center py-3 text-muted">
                    <BellFill size={20} className="mb-2" />
                    <div>Ingen nye varsler</div>
                </Dropdown.ItemText>
            ) : (
                notifications.map(notification => (
                    <Dropdown.Item 
                        key={notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="py-3"
                    >
                        <Stack direction="horizontal" gap={2}>
                            {!notification.isRead ? (
                                <CircleFill className="text-primary" size={8} />
                            ) : (
                                <Circle className="text-muted" size={8} />
                            )}
                            <Stack className="w-100">
                                <div className={!notification.isRead ? 'fw-semibold' : ''}>
                                    {notification.message}
                                </div>
                                <small className="text-muted">
                                    {new Date(notification.createdAt).toLocaleString('no-NO', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: 'numeric',
                                        month: 'short'
                                    })}
                                </small>
                            </Stack>
                        </Stack>
                    </Dropdown.Item>
                ))
            )}
        </Dropdown.Menu>
    </Dropdown>
    );
};

export default NotificationDropdown;