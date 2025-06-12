import React, {Fragment, useState} from 'react';
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
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import { Modal, Box, Typography } from '@mui/material';


const HomePage2 = () => {
    //const [openModal, setOpenModal] = useState(false)
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

    //useEffect(() => {
    //    setOpenModal(true)
    //}, []);

    if (loading) return null; // Hoặc một loading spinner

    return(
        <Fragment>
            <Navbar/>
            <Hero2/>
            <ServiceSectionS2/>
            <WorkSection/>
            <PartnerSection/>
            <Footer/>
            <Scrollbar />

            {/*<Modal*/}
            {/*    open={openModal}*/}
            {/*    onClose={() => setOpenModal(false)}*/}
            {/*    aria-labelledby="maintenance-title"*/}
            {/*    aria-describedby="maintenance-description"*/}
            {/*    disableAutoFocus*/}
            {/*>*/}
            {/*    <Box*/}
            {/*        sx={{*/}
            {/*            position: 'absolute',*/}
            {/*            top: '50%',*/}
            {/*            left: '50%',*/}
            {/*            transform: 'translate(-50%, -50%)',*/}
            {/*            width: 400,*/}
            {/*            bgcolor: 'background.paper',*/}
            {/*            border: '2px solid #000',*/}
            {/*            boxShadow: 24,*/}
            {/*            borderRadius: 2,*/}
            {/*            p: 4,*/}
            {/*            textAlign: 'center'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <DoNotDisturbOffIcon color="error" sx={{ fontSize: 50, mb: 2 }} />*/}
            {/*        <Typography id="maintenance-title" variant="h6" component="h2">*/}
            {/*            Thông báo bảo trì*/}
            {/*        </Typography>*/}
            {/*        <Typography id="maintenance-description" sx={{ mt: 2 }}>*/}
            {/*            Hệ thống đang được bảo trì. Một số chức năng có thể bị gián đoạn.*/}
            {/*        </Typography>*/}
            {/*    </Box>*/}
            {/*</Modal>*/}
        </Fragment>
    )
};
export default HomePage2;