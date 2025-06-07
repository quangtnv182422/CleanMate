import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import About from '../../components/about/about'
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import WorkSection from '../../components/WorkSection/WorkSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import FunFact from '../../components/FunFact/FunFact';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import ServiceSectionS2 from '../../components/ServiceSectionS2/ServiceSectionS2';


const AboutPage = () => {
    return (
        <Fragment>
            <Navbar/>
            <About />
            <ServiceSectionS2 />
            <WorkSection />
            <TeamSection />
            <Testimonial />
            <PartnerSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default AboutPage;
