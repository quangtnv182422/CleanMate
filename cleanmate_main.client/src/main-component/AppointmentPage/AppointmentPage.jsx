import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import AppointmentS2 from '../../components/AppointmentS2/AppointmentS2';
import Logo from '../../images/logo.svg'


const AppointmentPage =() => {
    return(
        <Fragment>
            <Navbar Logo={Logo}/>
            <PageTitle pageTitle={'Appointment'} pagesub={'Appointment'}/> 
            <AppointmentS2/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default AppointmentPage;
