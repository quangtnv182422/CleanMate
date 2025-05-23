import React, { useContext } from 'react'
import {useNavigate} from 'react-router-dom';
import Services from '../../api/service';
import { Link } from 'react-router-dom'
import { BookingContext } from '../../context/BookingProvider';
import BookingService from '../../components/BookingService/BookingService';

const ServiceSidebar = ({ id }) => {
    const { open, handleOpen, handleClose } = useContext(BookingContext);
    const navigate = useNavigate();

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="col-lg-4 col-md-8">
            <div className="wpo-single-sidebar">
                <div className="wpo-newsletter-widget widget">
                    <h2>Hãy đặt dịch vụ</h2>
                    <p>Bấm đăng ký dịch vụ để hoàn thiện thông tin</p>
                    <form className="form" onSubmit={SubmitHandler}>
                        <button type="submit" style={{ fontSize: "18px" }} onClick={() => navigate(`/booking-service?service=${id}`)}>Đăng ký dịch vụ</button>
                    </form>
                </div>
                <div className="wpo-contact-widget widget">
                    <h2>Chúng Tôi Có Thể <br /> Giúp Bạn Như Nào!</h2>
                    <p>Hãy liên hệ với chúng tôi để chúng tôi có thể giải đáp những thắc mắc của bạn. </p>
                    <Link to="/contact">Liên hệ với chúng tôi</Link>
                </div>
            </div>
        </div>

    )
}

export default ServiceSidebar;