import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TodoList from './pages/TodoList';

const MainComp = () => {
    return (
        <div>
            <Header />
            <TodoList />
            <Footer />
        </div>
    );
};

export default MainComp;
