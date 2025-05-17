import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Projects from '../../api/project'
import { Link } from "react-router-dom";

const settings = {
    dots: false,
    arrows: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const ProjectSection = () => {
    return (
        <section className="wpo-project-section section-padding">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5">
                        <div className="wpo-section-title">
                            <h2>Our Projects</h2>
                            <p>It was popularised in the with the release desktop
                                publishing software like versions .</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="wpo-project-slider">
                            <Slider {...settings}>
                                {Projects.slice(0, 6).map((project, prj) => (
                                    <div className="item" key={prj}>
                                        <div className="single-work">
                                            <img className="img-responsive" src={project.pImg} alt="" />
                                            <div className="hover_layer">
                                                <div className="info">
                                                    <h3><Link onClick={ClickHandler} to={`/project-single/${project.Id}`}>{project.title}</Link></h3>
                                                    <p>{project.subTitle}</p>
                                                </div>
                                                <div className="details-btn">
                                                    <Link className="project-btn" onClick={ClickHandler} to={`/project-single/${project.Id}`}>+</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProjectSection;