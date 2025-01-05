import React, { useState, useEffect } from 'react';
import { Badge,  Offcanvas } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons';
import { fetchNotifications, markNotificationAsRead } from '../handlers/NotificationApiHandler';

const NotificationDropdown = ({ expanded }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

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
        const interval = setInterval(getNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {expanded ? (
    <div 
        className="d-flex align-items-center gap-2 px-3 py-2" 
        style={{ cursor: 'pointer' }}
        onClick={() => setIsOpen(true)}
    >
        <BellFill size={20} className="text-white" />
        <span className="text-white">Varsler</span>
        {unreadCount > 0 && (
            <Badge bg="danger" pill>
                {unreadCount}
            </Badge>
        )}
    </div>
) : (
    <div className="px-3 py-2" style={{ position: 'relative' }}>
        <BellFill 
            size={20} 
            className="text-white"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsOpen(true)}
        />
        {unreadCount > 0 && (
            <Badge 
                bg="danger" 
                className="position-absolute"
                style={{ 
                    fontSize: '0.65rem',
                    top: '-5px',
                    right: '-5px'
                }}
            >
                {unreadCount}
            </Badge>
        )}
    </div>
)}


            <Offcanvas 
                show={isOpen} 
                onHide={() => setIsOpen(false)}
                placement="end"
                style={{
                    width: '300px',
                    background: '#1e1e1e'
                }}
            >
                <Offcanvas.Header closeButton className="border-bottom border-secondary">
                    <Offcanvas.Title className="text-white">
                        <div className="d-flex align-items-center gap-2">
                            <BellFill size={16} />
                            <span>Varsler</span>
                            {unreadCount > 0 && (
                                <Badge bg="danger" pill>{unreadCount}</Badge>
                            )}
                        </div>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    {notifications.map(notification => (
                        <div 
                            key={notification.id}
                            className="border-bottom border-secondary p-2"
                            onClick={() => handleMarkAsRead(notification.id)}
                            style={{ 
                                cursor: 'pointer',
                                background: notification.isRead ? 'transparent' : '#363636'
                            }}
                        >
                            <div className="text-white small">
                                {notification.message}
                            </div>
                            <div 
                                className="text-white ms-auto" 
                                style={{ fontSize: '0.7rem', textAlign: 'right' }}
                            >
                                {new Date(notification.createdAt).toLocaleString('no-NO')}
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="text-center text-muted p-3">
                            Ingen varsler å vise
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};


export default NotificationDropdown;
