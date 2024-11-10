import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TodoList from './pages/TodoList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const MainComp = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<TodoList />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default MainComp;