import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BookingContext } from '../../context/BookingProvider';




const Commercial = () => {
    const navigate = useNavigate();
    const { services } = useContext(BookingContext);

    const ClickHandler = (serviceId) => {
        navigate(`/service-single/${serviceId}`)
    }

    return (
        <div className="wpo-service-wrap wpo-service-slide">
            <div className="row">
                {services.map((service, srv) => {
                    const isDisabled = service.serviceId !== 1;
                    return (
                        <div className="col-lg-4 col-md-6 col-12" key={srv}>
                            <div className={`wpo-service-item ${isDisabled ? 'disable' : ''}`} onClick={() => ClickHandler(service.serviceId)}>
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
                                            <h2>{service.name}</h2>
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