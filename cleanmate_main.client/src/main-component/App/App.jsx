import React from 'react';
import AllRoute from '../router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../sass/style.scss';
import AuthProvider from '../../../src/context/AuthContext';
import BookingProvider from '../../context/BookingProvider';
import BookingStatusProvider from '../../context/BookingStatusProvider';
import WorkProvider from '../../context/WorkProvider';
import { BrowserRouter } from 'react-router-dom';

const App = () => {

    return (
        <div className="App" id='scrool'>
            <BrowserRouter>
                <AuthProvider>
                    <BookingProvider>
                        <WorkProvider>
                            <BookingStatusProvider>
                                <AllRoute />
                                <ToastContainer />
                            </BookingStatusProvider>
                        </WorkProvider>
                    </BookingProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
