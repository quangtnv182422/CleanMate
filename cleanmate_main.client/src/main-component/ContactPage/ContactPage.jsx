import React, { Fragment } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Contactpage from '../../components/Contactpage/Contactpage'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo.svg'
import useAuth from '../../hooks/useAuth';

const ContactPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        const role = user?.roles?.[0];// Nếu là Cleaner thì return về trang public-work
        if (role === 'Cleaner') {
            toast.error("Bạn không có quyền truy cập trang này")
            navigate('/public-work');
        }
    }, [user, loading, navigate]);
    return(
        <Fragment>
            <Navbar Logo={Logo}/>
            <Contactpage/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ContactPage;

