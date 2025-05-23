import React, { Fragment, useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useParams } from 'react-router-dom'
import Services from '../../api/service';
import { Link } from 'react-router-dom'
import Benefits from './benefits'
import ServiceSidebar from './sidebar'
import Footer from '../../components/footer/Footer'
import MainImage from '../../images/service-single/hourly-cleaning-main-image.jpg';
import SubImage1 from '../../images/service-single/hourly-cleaning-sub-image-1.jpg';
import SubImage2 from '../../images/service-single/hourly-cleaning-sub-image-2.jpg';
import axios from 'axios';
import { BookingContext } from '../../context/BookingProvider';

const ServiceSinglePage = () => {
    const { id } = useParams();
    const [service, setService] = useState({});
    const { services } = useContext(BookingContext);
    //use params to get the id from the url
    //use id to get the service details from the api
    //use context to store the service details object

    const serviceDetails = services.find(item => item.serviceId === Number(id))

    const relatedServices = services.filter(item => item.serviceId !== Number(id));

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <Fragment>
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
                        <ServiceSidebar id={serviceDetails.serviceId} />
                    </div>
                </div>
            </section>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ServiceSinglePage;
