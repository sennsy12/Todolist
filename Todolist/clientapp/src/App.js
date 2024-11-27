import React from 'react';
import MainComp from './MainComp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <>
            <ToastContainer />
            <div className="App">
                <MainComp />
            </div>
        </>
    );
}

export default App;
