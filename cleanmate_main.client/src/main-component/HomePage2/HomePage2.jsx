import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero2 from '../../components/hero2/Hero2'
import Scrollbar from '../../components/scrollbar/scrollbar'
import ServiceSectionS2 from '../../components/ServiceSectionS2/ServiceSectionS2';
import WorkSection from '../../components/WorkSection/WorkSection';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const HomePage2 = () => {
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

    if (loading) return null; // Hoặc một loading spinner

    return(
        <Fragment>
            <Navbar/>
            <Hero2/>
            <ServiceSectionS2/>
            <WorkSection/>
            <PartnerSection/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage2;