import React, { useState, useEffect } from 'react';
import { Stack, Badge,  Offcanvas } from 'react-bootstrap';
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
                <div className="notification-container">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <BellFill size={16} className="text-white" />
                        <span className="text-white flex-grow-1">Varsler</span>
                        {unreadCount > 0 && (
                            <Badge 
                                bg="danger" 
                                pill
                                style={{ fontSize: '0.75rem' }}
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    <div 
                        style={{ 
                            maxHeight: '300px', 
                            overflowY: 'auto',
                            background: '#2d2d2d',
                            borderRadius: '3px'
                        }}
                    >
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
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                    {new Date(notification.createdAt).toLocaleString('no-NO')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div 
                        className="d-flex align-items-center"
                        style={{ position: 'relative', width: '100%' }}
                    >
                        <BellFill 
                            size={20} 
                            className="text-white" 
                            onClick={() => setIsOpen(true)}
                            style={{ cursor: 'pointer' }}
                        />
                        <span 
                            className="text-white ms-2" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIsOpen(true)}
                        >
                            Varsler
                        </span>
                        {unreadCount > 0 && (
                            <Badge 
                                bg="danger" 
                                className="position-absolute"
                                style={{ 
                                    fontSize: '0.65rem',
                                    top: '5px',
                                    right: '195px',
                                    transform: 'translate(50%, -50%)'
                                }}
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </div>

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
            )}
        </>
    );
};

export default NotificationDropdown;
