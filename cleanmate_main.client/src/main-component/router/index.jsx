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
import SignUpPage from '../SignUpPage/SignUpPage'
import ForgotPassword from '../ForgotPassword/ForgotPassword'
import PricingPage from '../PricingPage/PricingPage';


const AllRoute = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/home' element={<Homepage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/home2' element={<Homepage2 />} />
          <Route path='/home3' element={<Homepage3 />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/service' element={<ServicePage />} />
          <Route path='/service-s2' element={<ServicePageS2 />} />
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
          <Route path='/blog' element={<BlogPage />} />
          <Route path='/blog-left-sidebar' element={<BlogPageLeft />} />
          <Route path='/blog-fullwidth' element={<BlogPageFullwidth />} />
          <Route path='/team-single/:id' element={<TeamSinglePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AllRoute;
