import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import ServiceSectionS2 from '../../components/ServiceSectionS2/ServiceSectionS2';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'

const ServicePageS2 =() => {
    return(
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={'Dịch vụ'} pagesub={'Dịch vụ'}/> 
            <ServiceSectionS2/>
            <PartnerSection tNone={'partners-section-s2'}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ServicePageS2;

