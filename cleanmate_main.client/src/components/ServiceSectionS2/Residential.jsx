import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BookingContext } from '../../context/BookingProvider';


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Commercial = () => {
    const { services } = useContext(BookingContext);

    return (
        <div className="wpo-service-wrap wpo-service-slide">
            <div className="row">
                {services.map((service, srv) => {
                    const isDisabled = service.serviceId !== 1;
                    return (
                        <div className="col-lg-4 col-md-6 col-12" key={srv}>
                            <div className={`wpo-service-item ${isDisabled ? 'disable' : ''}`}>
                                {/*<div className="wpo-service-icon">*/}
                                {/*    <div className="icon">*/}
                                {/*        <img src={service.sIcon} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="wpo-service-text">
                                    {isDisabled ?
                                        (
                                            <h2 onClick={() => alert("Chưa hoàn thiện chức năng")}>{service.name}</h2>
                                        ) : (
                                            <h2><Link onClick={ClickHandler} to={`/service-single/${service.serviceId}`}>{service.name}</Link></h2>
                                        )
                                    }
                                    <p>{service.description}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Commercial;