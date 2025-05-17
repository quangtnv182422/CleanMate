import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Testimonial from '../../components/Testimonial/Testimonial';
import Footer from '../../components/footer/Footer'
import PartnerSection from '../../components/PartnerSection/PartnerSection';

const TestimonialPage = (props) => {


    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Testimonials'} pagesub={'Testimonials'} />
            <Testimonial />
            <PartnerSection tNone={'partners-section-s2'}/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default TestimonialPage;
