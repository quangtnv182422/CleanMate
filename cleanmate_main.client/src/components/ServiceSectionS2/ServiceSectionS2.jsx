import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Residential from './Residential';
import Commercial from './Commercial';


const ServiceSectionS2 = (props) => {

    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }


    return (
        <section className="wpo-service-section-s2 section-padding">
            <div className="container">
                <div className="row align-items-center justify-content-between">
                    <div className="col-lg-5">
                        <div className="wpo-section-title-s2">
                            <h2>Dịch vụ của chúng tôi</h2>
                            <p>Chúng tôi cung cấp giải pháp vệ sinh chuyên nghiệp, linh hoạt và phù hợp với mọi nhu cầu của bạn.</p>
                        </div>
                    </div>
                </div>
                <Residential />
            </div>
        </section>

    )
}

export default ServiceSectionS2;