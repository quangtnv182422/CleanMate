import React from 'react';
import AllRoute from '../router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../sass/style.scss';
import AuthProvider from '../../../src/context/AuthContext';


const App = () => {

    return (
        <div className="App" id='scrool'>
            <AuthProvider>
                <AllRoute />
                <ToastContainer />
            </AuthProvider>
        </div>
    );
}

export default App;
