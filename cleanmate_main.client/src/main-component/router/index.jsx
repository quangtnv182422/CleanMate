import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";

import Homepage from '../HomePage/HomePage'
import Homepage2 from '../HomePage2/HomePage2'
import Homepage3 from '../HomePage3/Homepage3'
import AboutPage from '../AboutPage/AboutPage'
import BlogPage from '../BlogPage/BlogPage'
import BlogPageLeft from '../BlogPageLeft/BlogPageLeft'
import BlogPageFullwidth from '../BlogPageFullwidth/BlogPageFullwidth'
import BlogDetails from '../BlogDetails/BlogDetails'
import BlogDetailsFull from '../BlogDetailsFull/BlogDetailsFull'
import BlogDetailsLeftSiide from '../BlogDetailsLeftSiide/BlogDetailsLeftSiide'
import ContactPage from '../ContactPage/ContactPage'
import ErrorPage from '../ErrorPage/ErrorPage'
import TeamSinglePage from '../TeamSinglePage/TeamSinglePage'
import ServicePage from '../ServicePage/ServicePage';
import ServicePageS2 from '../ServicePageS2/ServicePageS2';
import ServiceSinglePage from '../ServiceSinglePage/ServiceSinglePage'
import ProjectPage from '../ProjectPage/ProjectPage';
import ProjectSinglePage from '../ProjectSinglePage/ProjectSinglePage'
import AppointmentPage from '../AppointmentPage/AppointmentPage'
import TermPage from '../TermPage/TermPage';
import TestimonialPage from '../TestimonialPage/TestimonialPage';
import LoginPage from '../LoginPage/LoginPage'
import SignUpPageUser from '../SignUpPage/SignUpPageUser'
import SignUpPageEmployee from '../SignUpPage/SignUpPageEmployee'
import ForgotPassword from '../ForgotPassword/ForgotPassword'
import PricingPage from '../PricingPage/PricingPage';
import EmailConfirmation from '../ConfirmMail/EmailConfirmation';
import Profile from '../Profile/Profile';
import WorkList from '../WorkList/WorkList';
import BookingSuccess from '../../components/BookingComplete/BookingSuccess';
import BookingFail from '../../components/BookingComplete/BookingFail';
import BookingConfirmation from '../../components/BookingConfirmation/BookingConfirmation';
import BookingService from '../../components/BookingService/BookingService';
const AllRoute = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Homepage2 />} />
                    <Route path='/contact' element={<ContactPage />} />
                    <Route path='/home' element={<Homepage2 />} />
                    <Route path='/about' element={<AboutPage />} />
                    <Route path='/service' element={<ServicePageS2 />} />
                    <Route path='/service-single/:id' element={<ServiceSinglePage />} />
                    <Route path='/project' element={<ProjectPage />} />
                    <Route path='/project-single/:id' element={<ProjectSinglePage />} />
                    <Route path='/appointment' element={<AppointmentPage />} />
                    <Route path='/terms' element={<TermPage />} />
                    <Route path='/testimonial' element={<TestimonialPage />} />
                    <Route path='/pricing' element={<PricingPage />} />
                    <Route path='/404' element={<ErrorPage />} />
                    <Route path='/blog-single/:id' element={<BlogDetails />} />
                    <Route path='/blog-single-left-sidebar/:id' element={<BlogDetailsLeftSiide />} />
                    <Route path='/blog-single-fullwidth/:id' element={<BlogDetailsFull />} />
                    <Route path='/blog-fullwidth' element={<BlogPage />} />
                    <Route path='/blog-left-sidebar' element={<BlogPageLeft />} />
                    <Route path='/blog' element={<BlogPageFullwidth />} />
                    <Route path='/team-single/:id' element={<TeamSinglePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register/user' element={<SignUpPageUser />} />
                    <Route path='/register/employee' element={<SignUpPageEmployee />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path="/email-confirmation" element={<EmailConfirmation />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/work-list" element={<WorkList />} />
                    <Route path="booking-confirmation/:id" element={<BookingConfirmation />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/booking-fail" element={<BookingFail />} />
                    <Route path="/booking-service" element={<BookingService />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default AllRoute;
