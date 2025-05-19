import React from 'react'
import Services from '../../api/service';
import {Link} from  'react-router-dom'

const ServiceSidebar = (props) => {

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }

    return (
        <div className="col-lg-4 col-md-8">
            <div className="wpo-single-sidebar">
                <div className="wpo-service-widget widget">
                    <h2>Tất cả dịch vụ</h2>
                    <ul>
                        {Services.slice(0,6).map((service, Sitem) => (
                            <li key={Sitem}><Link onClick={ClickHandler} to={`/service-single/${service.Id}`}>{service.sTitle}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="wpo-newsletter-widget widget">
                    <h2>Hãy đặt dịch vụ</h2>
                    <p>Bấm đăng ký dịch vụ để hoàn thiện thông tin</p>
                    <form className="form" onSubmit={SubmitHandler}>
                        <button type="submit" style={{ fontSize: "18px" } }>Đăng ký dịch vụ</button>
                    </form>
                </div>
                <div className="wpo-instagram-widget widget">
                    <h2>Instagram Shot</h2>
                    <ul>
                        {Services.slice(0,6).map((service, Sitem) => (
                            <li key={Sitem}><img src={service.sImg} alt="" /></li>
                        ))}
                    </ul>
                </div>
                <div className="wpo-contact-widget widget">
                    <h2>Chúng Tôi Có Thể <br/> Giúp Bạn Như Nào!</h2>
                    <p>Hãy liên hệ với chúng tôi để chúng tôi có thể giải đáp những thắc mắc của bạn. </p>
                    <Link to="/contact">Liên hệ với chúng tôi</Link>
                </div>
            </div>
        </div>

    )
}

export default ServiceSidebar;