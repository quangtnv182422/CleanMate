﻿import React from 'react';
import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom";

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
import Payment from '../../components/Payment/Payment';
import GoogleMapAutocomplete from '../../components/GoogleMap/GoogleMapAutocomplete';
import DepositCoin from '../../components/Coin/DepositCoin';
import OrderHistory from '../OrderHistory/OrderHistory';
import Loading from '../../components/Loading/Loading';
import BookingDetails from '../../components/BookingDetails/BookingDetails';
import WithdrawCoin from '../../components/Coin/WithdrawCoin';
import NoRating from '../NoRating/NoRating';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import ChangePassword from '../ResetPassword/ChangePassword';
import ResetPassword from '../ResetPassword/ResetPassword';
import ServiceInformation from '../../components/ServiceInformation/ServiceInformation';
import Voucher from '../Voucher/Voucher';

const AllRoute = () => {
    const location = useLocation();

    return (
        <div className="App">
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
                <Route path='/team-single' element={<TeamSinglePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register/user' element={<SignUpPageUser />} />
                <Route path='/register/employee' element={<SignUpPageEmployee />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path="/email-confirmation" element={<EmailConfirmation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/public-work" element={<WorkList />} />
                <Route path="/order/booking-confirmation/:id" element={<BookingConfirmation />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/booking-fail" element={<BookingFail />} />
                <Route path="/booking-service" element={<BookingService key={location.search} />} />
                <Route path="/order/payment" element={<Payment />} />
                <Route path="/booking-service/choose-address" element={<GoogleMapAutocomplete />} />
                <Route path="/coin/deposit" element={<DepositCoin />} />
                <Route path="/coin/withdraw" element={<WithdrawCoin />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/loading" element={<Loading />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/order/no-rating-yet" element={<NoRating />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/service-information" element={<ServiceInformation />} />
                <Route path="/voucher" element={<Voucher />} />
            </Routes>
        </div>
    );
}

export default AllRoute;
