import React, { Fragment } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import ServiceSectionS2 from '../../components/ServiceSectionS2/ServiceSectionS2';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import useAuth from '../../hooks/useAuth';

const ServicePageS2 = () => {
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
            <Navbar/>
            <ServiceSectionS2/>
            <PartnerSection tNone={'partners-section-s2'}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ServicePageS2;

