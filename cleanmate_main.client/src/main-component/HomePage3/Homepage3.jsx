import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero3 from '../../components/hero3/hero3'
import Scrollbar from '../../components/scrollbar/scrollbar'
import ServiceSectionS2 from '../../components/ServiceSectionS2/ServiceSectionS2';
import WorkSection from '../../components/WorkSection/WorkSection';
import Appointment from '../../components/Appointment/Appointment';
import ProjectSection from '../../components/ProjectSection/ProjectSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer';


const Homepage3 =() => {
    return(
        <Fragment>
            <Navbar topbarNone={'topbar-none'}/>
            <Hero3/>
            <ServiceSectionS2/>
            <WorkSection/>
            <Appointment/>
            <ProjectSection/>
            <TeamSection/>
            <Testimonial/>
            <BlogSection/>
            <PartnerSection/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default Homepage3;