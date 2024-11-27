import React from 'react';
import { Nav, Container, Button, Stack } from 'react-bootstrap';
import { List, X, House, Share, BoxArrowRight, Key, PersonPlus } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import NotificationDropdown from './NotificationDropdown';

const Sidebar = ({ expanded, onToggle, onLogout }) => {
    const handleLogout = () => {
        toast.info(
            <div>
                <p>Er du sikker på at du vil logge ut?</p>
                <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => toast.dismiss()}
                    >
                        Avbryt
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => {
                            toast.dismiss();
                            onLogout();
                        }}
                    >
                        Logg ut
                    </Button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'bg-dark text-white',
            }
        );
    };

    return (
        <Container 
            fluid 
            className={`bg-dark position-fixed h-100 p-0`} 
            style={{ 
                width: expanded ? '240px' : '70px',
                transition: 'width 0.3s ease',
                zIndex: 1030 
            }}
        >
            <Stack className="h-100">
                <div className="p-3 border-bottom border-secondary">
                    <Stack direction="horizontal" className="justify-content-between align-items-center">
                        {expanded && (
                            <h3 className="text-white mb-0 fs-5">Todo App</h3>
                        )}
                        <Button 
                            variant="link" 
                            className="text-white p-1" 
                            onClick={onToggle}
                        >
                            {expanded ? <X size={20} /> : <List size={20} />}
                        </Button>
                    </Stack>
                </div>

                <Nav className="flex-column flex-grow-1">
                    {!localStorage.getItem('token') ? (
                        <>
                            <Nav.Link 
                                href="/login" 
                                className="text-white py-3 px-3"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <Stack direction="horizontal" gap={2}>
                                    <Key />
                                    {expanded && 'Logg Inn'}
                                </Stack>
                            </Nav.Link>
                            <Nav.Link 
                                href="/register" 
                                className="text-white py-3 px-3"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <Stack direction="horizontal" gap={2}>
                                    <PersonPlus />
                                    {expanded && 'Registrer'}
                                </Stack>
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            {expanded && (
                                <div className="px-3 py-3">
                                    <NotificationDropdown />
                                </div>
                            )}
                            <Nav.Link 
                                href="/" 
                                className="text-white py-3 px-3"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <Stack direction="horizontal" gap={2}>
                                    <House />
                                    {expanded && 'Mine Oppgaver'}
                                </Stack>
                            </Nav.Link>
                            <Nav.Link 
                                href="/shared-todos" 
                                className="text-white py-3 px-3"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <Stack direction="horizontal" gap={2}>
                                    <Share />
                                    {expanded && 'Delte Todos'}
                                </Stack>
                            </Nav.Link>
                            <Nav.Link 
                                onClick={handleLogout} 
                                className="text-white py-3 px-3 mt-auto"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <Stack direction="horizontal" gap={2}>
                                    <BoxArrowRight />
                                    {expanded && 'Logg Ut'}
                                </Stack>
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </Stack>
        </Container>
    );
};

export default Sidebar;
