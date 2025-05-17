import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ts1 from '../../images/testimonial.jpg'


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
        Des: "There are many variations of passages the majority have suffered alteration some form injected humour randomise words which don't look even slightly believable are going use a passage of need to be sure.",
        Title: 'Robert William',
        Sub: "CEO & Founder",
    },
    {
        Des: "There are many variations of passages the majority have suffered alteration some form injected humour randomise words which don't look even slightly believable are going use a passage of need to be sure.",
        Title: 'Ken Williamson',
        Sub: "CEO & Founder",
    },
    {
        Des: "There are many variations of passages the majority have suffered alteration some form injected humour randomise words which don't look even slightly believable are going use a passage of need to be sure.",
        Title: 'David Miller',
        Sub: "CEO & Founder",
    }
]

const Testimonial = () => {
    return (
        <section className="wpo-testimonials-section section-padding">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5">
                        <div className="wpo-section-title">
                            <h2>What Clients Say?</h2>
                            <p>It was popularised in the with the release desktop
                                publishing software like versions .</p>
                        </div>
                    </div>
                </div>
                <div className="wpo-testimonials-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-12">
                            <div className="wpo-testimonials-img">
                                <img src={ts1} alt="" />
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