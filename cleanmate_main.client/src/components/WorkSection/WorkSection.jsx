import React from 'react'

import wImg1 from '../../images/work/1.jpg'
import wImg2 from '../../images/work/2.jpg'
import wImg3 from '../../images/work/3.jpg'

const WorkSection = (props) => {
    return (
        <section className="wpo-work-section section-padding">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5">
                        <div className="wpo-section-title">
                            <h2>How It Works</h2>
                            <p>It was popularised in the with the release desktop
                                publishing software like versions .</p>
                        </div>
                    </div>
                </div>
                <div className="wpo-work-wrap">
                    <div className="row">
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-work-item">
                                <div className="wpo-work-img">
                                    <img src={wImg1} alt=""/>
                                </div>
                                <div className="wpo-work-text">
                                    <h2>Easy Online Scheduling</h2>
                                </div>
                                <div className="visible-text">
                                    <span>1</span>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-work-item">
                                <div className="wpo-work-text">
                                    <h2>Get Clean <br/> And Fresh</h2>
                                </div>
                                <div className="visible-text">
                                    <span>2</span>
                                </div>
                                <div className="wpo-work-img">
                                    <img src={wImg2} alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-work-item">
                                <div className="wpo-work-img">
                                    <img src={wImg3} alt=""/>
                                </div>
                                <div className="wpo-work-text">
                                    <h2>Enjoy Happy Cleanliness</h2>
                                </div>
                                <div className="visible-text">
                                    <span>3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WorkSection;