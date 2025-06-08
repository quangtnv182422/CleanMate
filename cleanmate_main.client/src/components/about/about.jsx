import React from 'react'
import abimg from '../../images/about-image.jpg'
import sign from '../../images/signature.png'


const About = (props) => {
    return(
        <section className="wpo-about-section section-padding">
            <div className="container">
                <div className="wpo-about-section-wrapper">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-12 col-12">
                            <div className="wpo-about-img">
                                <img src={abimg} alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-12 col-12">
                            <div className="wpo-about-content">
                                <div className="wpo-section-title-s2">
                                    <h2>Đôi lời giới thiệu về chúng tôi</h2>
                                </div>
                                <div className="wpo-about-content-inner">
                                    <p>Bạn mệt mỏi vì phải tìm kiếm người dọn dẹp đáng tin cậy? CleanMate là giải pháp tối ưu dành cho bạn! Chúng tôi là nền tảng sáng tạo kết nối liền mạch những cá nhân và doanh nghiệp có nhu cầu với những người dọn dẹp chuyên nghiệp, đáng tin cậy. Hãy nói lời tạm biệt với căng thẳng
                                        và chào đón một không gian sạch sẽ, lấp lánh - thật dễ dàng.</p>
                                    <p>Tại CleanMate, chúng tôi tin rằng một không gian sạch sẽ không nên là một thứ xa xỉ, mà là một điều thiết thực dễ dàng tiếp cận. Chúng tôi thấu hiểu khó khăn khi tìm kiếm các dịch vụ dọn dẹp
                                        đáng tin cậy, đó là lý do tại sao chúng tôi đã tạo ra một nền tảng trực quan được thiết kế để đơn giản hóa cuộc sống của bạn. Dù bạn là một người bận rộn, một gia đình năng động, hay một người dọn dẹp đang tìm kiếm cơ hội, CleanMate sẽ là cầu nối, biển những không gian nguyên sơ và những kết nối công việc hiệu quả thành hiện thực.</p>
                                    <div className="signeture">
                                        <h4>Trương Nguyễn Việt Quang</h4>
                                        <p>CEO của CleanMate</p>
                                        <span><img src={sign} alt="chữ ký giám đốc"/></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About;