import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../../images/footer-logo-transparent.png';
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
                        <div className="col col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <img src={Logo} alt="blog" />
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Xem nhanh</h3>
                                </div>
                                <ul>
                                    <li><Link to="/about">Về chúng tôi </Link></li>
                                    <li><Link to="/service-s2">Dịch vụ</Link></li>
                                    <li><Link to="/contact">Liên hệ chúng tôi </Link></li>
                                    <li><Link to="/terms">Chính sách & Điều khoản</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-12 col-sm-12 col-12">
                            <div className="widget join-widget">
                                <div className="widget-title">
                                    <h3>Gửi thư cho chúng tôi</h3>
                                </div>
                                <p>Gửi thư cho chúng tôi để được hỗ trợ.</p>
                                <form onSubmit={SubmitHandler}>
                                    <input type="email" placeholder="support@gmail.com" required />
                                    <button type="submit">Gửi ngay  <i className="ti-arrow-right"></i></button>
                                </form>
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