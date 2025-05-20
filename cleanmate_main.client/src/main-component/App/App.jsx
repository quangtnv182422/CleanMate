import React from 'react';
import AllRoute from '../router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../sass/style.scss';
import AuthProvider from '../../../src/context/AuthContext';
import BookingProvider from '../../context/BookingProvider';


const App = () => {

    return (
        <div className="App" id='scrool'>
            <AuthProvider>
                <BookingProvider>
                    <AllRoute />
                    <ToastContainer />
                </BookingProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
