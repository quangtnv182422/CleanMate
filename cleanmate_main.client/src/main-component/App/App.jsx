import React from 'react';
import AllRoute from '../router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../sass/style.scss';
import AuthProvider from '../../../src/context/AuthContext';
import BookingProvider from '../../context/BookingProvider';
import BookingStatusProvider from '../../context/BookingStatusProvider';

const App = () => {

    return (
        <div className="App" id='scrool'>
            <AuthProvider>
                <BookingProvider>
                    <BookingStatusProvider>
                        <AllRoute />
                        <ToastContainer />
                    </BookingStatusProvider>
                </BookingProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
