import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Contactpage from '../../components/Contactpage/Contactpage'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo.svg'

const ContactPage =() => {
    return(
        <Fragment>
            <Navbar Logo={Logo}/>
            <PageTitle pageTitle={'Liên hệ với chúng tôi'} pagesub={'Liên hệ'}/> 
            <Contactpage/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ContactPage;

