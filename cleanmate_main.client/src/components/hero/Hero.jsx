import React from "react";
import { Link } from 'react-router-dom'
import VideoModal from '../ModalVideo/VideoModal'

import simg1 from '../../images/slider/right-img.png'




const Hero = () => {
    return (
        <section className="wpo-hero-section-1">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-5 col-lg-5 col-12">
                        <div className="wpo-hero-section-text">
                            <div className="wpo-hero-title">
                                <h2>Need Cleaning Service?</h2>
                            </div>
                            <div className="wpo-hero-subtitle">
                                <p>We are certified company. We provide best cleaning services for you & your company .
                                </p>
                            </div>
                            <div className="btns">
                                <Link to="/about" className="btn theme-btn"><i className="fa fa-angle-double-right"
                                    aria-hidden="true"></i> Our Best Offers</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-vec">
                <div className="right-img">
                    <div className="r-img">
                        <img src={simg1} alt="hero" />
                    </div>
                </div>
            </div>
            <div className="pop-up-video">
                <div className="video-holder">
                    <VideoModal/>
                </div>
            </div>
        </section>
    )
}



export default Hero;