import React from "react";
import Services from '../../api/service'
import { Link } from "react-router-dom";


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Commercial = (props) => {
    return(
        <div className="wpo-service-wrap wpo-service-slide">
            <div className="row">
                {Services.slice(6,12).map((service, srv) => (
                    <div className="col-lg-4 col-md-6 col-12" key={srv}>
                        <div className="wpo-service-item">
                            <div className="wpo-service-icon">
                                <div className="icon">
                                    <img src={service.sIcon} alt=""/>
                                </div>
                            </div>
                            <div className="wpo-service-text">
                                <h2><Link onClick={ClickHandler} to={`/service-single/${service.Id}`}>{service.sTitle}</Link></h2>
                                <p>{service.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Commercial;