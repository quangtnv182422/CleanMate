import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ts1 from '../../images/cleaner-with-client.jpg'


const settings = {
    dots: true,
    arrows: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
};

const testimonial = [
    {
        Des: "Là một giáo viên với lịch trình dày đặc, tôi rất trân trọng dịch vụ dọn dẹp của CleanMate. Đội ngũ luôn đúng giờ, làm việc cẩn thận và chu đáo, biến ngôi nhà của tôi trở nên sạch sẽ, gọn gàng. Nhờ họ, tôi có thêm thời gian để tập trung vào việc giảng dạy và chăm sóc gia đình!",
        Title: 'Chị Trần Minh Phương',
        Sub: "Giáo viên cấp 3",
    },
    {
        Des: "Với tư cách là một kỹ sư phần mềm, tôi thường làm việc tại nhà và cần một không gian sạch sẽ để tối ưu hóa sự tập trung. CleanMate đã vượt mong đợi với dịch vụ chuyên nghiệp, nhanh chóng và thân thiện. Họ không chỉ dọn dẹp kỹ lưỡng mà còn rất linh hoạt với lịch trình bận rộn của tôi. Rất đáng tin cậy!",
        Title: 'Anh Hoành Trọng Hà',
        Sub: "Kỹ sư phần mềm",
    },
    {
        Des: "Công việc bác sĩ của tôi đòi hỏi sự tập trung cao độ và thường xuyên làm việc ca đêm, nên tôi không có nhiều thời gian để dọn dẹp nhà cửa. CleanMate đã trở thành cứu tinh với dịch vụ chất lượng cao, đội ngũ tận tâm và luôn chú ý đến từng chi tiết. Tôi hoàn toàn yên tâm giao phó ngôi nhà của mình cho họ!",
        Title: 'Ông Nguyễn Hồng Quyến',
        Sub: "Bác sĩ",
    }
]

const Testimonial = () => {
    return (
        <section className="wpo-testimonials-section section-padding">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5">
                        <div className="wpo-section-title">
                            <h2>Khách hàng nói gì về dịch vụ của chúng tôi?</h2>
                            <p>"Chúng tôi đánh giá cao dịch vụ chuyên nghiệp, nhanh chóng và thân thiện của CleanMate!"</p>
                        </div>
                    </div>
                </div>
                <div className="wpo-testimonials-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-12">
                            <div className="wpo-testimonials-img">
                                <img src={ts1} alt="Khách hàng với CleanMate" style={{ height: '500px', width: '500px', objectFit: 'contain' }} />
                            </div>
                        </div>
                        <div className="col-lg-7 col-12">
                            <div className="wpo-testimonials-text">
                                <div className="quote">
                                    <i className="fa fa-quote-left" aria-hidden="true"></i>
                                </div>
                                <div className="wpo-testimonials-slide owl-carousel">
                                    <Slider {...settings}>
                                        {testimonial.map((tesmnl, tsm) => (
                                            <div className="wpo-testimonials-slide-item" key={tsm}>
                                                <p>{tesmnl.Des}</p>
                                                <h5>{tesmnl.Title}</h5>
                                                <span>{tesmnl.Sub}</span>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonial;