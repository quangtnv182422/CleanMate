import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../images/footer-logo.svg'
import Services from '../../api/service';


const ClickHandler = () => {
    window.scrollTo(10, 0);
}
const SubmitHandler = (e) => {
    e.preventDefault()
}

const Footer = (props) => {
    return (
        <footer className="wpo-site-footer">
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <img src={Logo} alt="blog"/>
                                </div>
                                <p>Many desktop publishing packages
                                    now use Lorem Ipsum their default
                                    a search for uncover many.</p>
                                <p>Many desktop publishing packages
                                    now use uncover many.</p>

                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Quick Link</h3>
                                </div>
                                <ul>
                                    <li><Link to="/about">About Us </Link></li>
                                    <li><Link to="/service-s2">Service</Link></li>
                                    <li><Link to="/appointment">Appointment</Link></li>
                                    <li><Link to="/contact">Contact Us </Link></li>
                                    <li><Link to="/project">Projects</Link></li>
                                    <li><Link to="/terms">Terms & Conditions</Link></li>

                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget join-widget">
                                <div className="widget-title">
                                    <h3>Newsletter</h3>
                                </div>
                                <p>Now use Lorem Ipsum their default
                                    a search for uncover many.</p>
                                <form onSubmit={SubmitHandler}>
                                    <input type="email" placeholder="support@gmail.com" required/>
                                    <button type="submit">Send Now <i className="ti-arrow-right"></i></button>
                                </form>
                            </div>
                        </div>

                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Services</h3>
                                </div>
                                <ul>
                                    {Services.slice(0,6).map((service, srv) => (
                                        <li key={srv}><Link onClick={ClickHandler} to={`/service-single/${service.Id}`}>{service.sTitle}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12">
                            <p className="copyright"> Copyright &copy; 2022 | All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;