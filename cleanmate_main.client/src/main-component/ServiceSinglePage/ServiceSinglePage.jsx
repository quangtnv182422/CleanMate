import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BookingContext } from '../../context/BookingProvider';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Benefits from './benefits'
import ServiceSidebar from './sidebar'
import Footer from '../../components/footer/Footer';
import ReactLoading from 'react-loading';
import MainImage from '../../images/service-single/hourly-cleaning-main-image.webp';
import SubImage1 from '../../images/service-single/hourly-cleaning-sub-image-1.jpg';
import SubImage2 from '../../images/service-single/hourly-cleaning-sub-image-2.jpg';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const ServiceSinglePage = () => {
    const { id } = useParams();
    const { services } = useContext(BookingContext);
    const [loading, setLoading] = useState(true);
    //use params to get the id from the url
    //use id to get the service details from the api
    //use context to store the service details object

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        const role = user?.roles?.[0];// Nếu là Cleaner thì return về trang public-work
        if (role === 'Cleaner') {
            toast.error("Bạn không có quyền truy cập trang này")
            navigate('/public-work');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000)

        return () => clearTimeout(timer);
    }, [])

    const serviceDetails = services.find(item => item?.serviceId === Number(id))

    const relatedServices = services.filter(item => item?.serviceId !== Number(id));

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <Fragment>
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '1000',
                }}
                >
                    <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
                </Box>
            )}
            <Navbar hclass={'wpo-header-style-5'} />
            <section className="wpo-service-single-section section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="wpo-service-single-wrap">
                                <div className="wpo-service-single-img">
                                    <img src={MainImage} alt="" />
                                </div>
                                <div className="wpo-service-single-content">
                                    <div className="wpo-service-single-content-des">
                                        <h2>{serviceDetails?.name}</h2>
                                        <p>{serviceDetails?.description}</p>
                                        <div className="wpo-service-single-sub-img">
                                            <ul>
                                                <li><img src={SubImage1} alt="" /></li>
                                                <li><img src={SubImage2} alt="" /></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="wpo-related-section">
                                    <h2>Dịch vụ bạn có thể quan tâm</h2>
                                    <div className="row">
                                        {relatedServices.map((service, Sitem) => (
                                            <div className="col-lg-6 col-md-6 col-12" key={Sitem}>
                                                <div className="wpo-related-item disable">
                                                    {/*<div className="wpo-related-icon">*/}
                                                    {/*    <div className="icon">*/}
                                                    {/*        <i><img src={service.sIcon} alt="" /></i>*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}
                                                    <div className="wpo-related-text">
                                                        <h3><Link onClick={ClickHandler} to={`/service-single/${service.serviceId}`}>{service.name}</Link></h3>
                                                        <p className="description">{service.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Benefits />
                            </div>
                        </div>
                        <ServiceSidebar id={serviceDetails?.serviceId} />
                    </div>
                </div>
            </section>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ServiceSinglePage;
