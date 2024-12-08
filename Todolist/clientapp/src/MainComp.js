import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Sidebar from './components/Sidebar';

// Importer sider
import TodoList from './pages/TodoList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SharedTodosPage from './pages/SharedTodosPage';
import { logoutUser } from './handlers/AuthHandler';

const MainComp = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <Sidebar
                expanded={sidebarExpanded}
                onToggle={() => setSidebarExpanded(!sidebarExpanded)}
                onLogout={handleLogout}
            />

            <div className="main-content flex-grow-1" style={{
                marginLeft: sidebarExpanded ? '240px' : '70px',
                transition: 'margin-left 0.3s ease',
                width: `calc(100% - ${sidebarExpanded ? "240px" : "70px"})`,
                minWidth: 0
            }}>
                <Container fluid>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/todos" element={<TodoList />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/shared-todos" element={<SharedTodosPage />} />
                    </Routes>
                </Container>
            </div>
        </div>
    );
};

export default MainComp;