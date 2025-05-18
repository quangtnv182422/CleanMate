import React from "react";
import Slider from "react-slick";
import { Link } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import hero1 from '../../images/slider/homepage-banner-image-1.jpg'
import hero2 from '../../images/slider/homepage-banner-image-2.jpg'



const settings = {
    dots: false,
    arrows: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    fade: true
};

const Hero2 = () => {
    return (
        <section className="wpo-hero-slider">
            <div className="hero-container">
                <div className="hero-wrapper">
                    <Slider {...settings}>
                        <div className="hero-slide">
                            <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${hero1})` }}>
                                <div className="gradient-overlay"></div>
                                <div className="container">
                                    <div className="slide-content">
                                        <div className="slide-title">
                                            <h2>Dịch vụ dọn dẹp chuyên nghiệp được tin tưởng.</h2>
                                        </div>
                                        <div className="slide-text">
                                            <p>Chúng tôi chăm sóc không gian của bạn như chính ngôi nhà của mình – sạch sẽ, gọn gàng với tất cả sự tận tâm</p>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="slide-btns">
                                            <Link to="/about" className="theme-btn"><i className="fa fa-angle-double-right"></i> Tìm hiểu thêm</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-slide">
                            <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${hero2})` }}>
                                <div className="gradient-overlay"></div>
                                <div className="container">
                                    <div className="slide-content">
                                        <div className="slide-title">
                                            <h2>Dịch Vụ Vệ Sinh Nhanh Chóng và Hiệu Quả Tận Nơi.</h2>
                                        </div>
                                        <div className="slide-text">
                                            <p>Giúp ngôi nhà hoặc văn phòng bạn luôn sạch bóng mà không tốn công sức — dịch vụ tin cậy, tiết kiệm thời gian.</p>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="slide-btns">
                                            <Link to="/about" className="theme-btn"><i className="fa fa-angle-double-right"></i> Tìm hiểu thêm</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </section>
    )
}

export default Hero2;