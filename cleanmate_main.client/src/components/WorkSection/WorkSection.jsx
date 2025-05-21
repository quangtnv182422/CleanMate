import React from 'react'

import wImg1 from '../../images/work/booking-step-1.jpg'
import wImg2 from '../../images/work/cleaning-image-step-2.jfif'
import wImg3 from '../../images/work/a-man-enjoying-after-cleaning.jfif'

const WorkSection = (props) => {
    return (
        <section className="wpo-work-section section-padding">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5">
                        <div className="wpo-section-title">
                            <h2>Cách hoạt động của dịch vụ</h2>
                            <p>Chỉ với vài bước đơn giản, bạn có thể đặt lịch và tận hưởng dịch vụ vệ sinh chuyên nghiệp ngay tại nhà.</p>
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
                                    <h2>Dễ dàng đặt lịch online</h2>
                                </div>
                                <div className="visible-text">
                                    <span>1</span>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-work-item">
                                <div className="wpo-work-text">
                                    <h2>Dọn Sạch Sẽ <br/> Và Thân Thiện</h2>
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
                                    <h2>Tận hưởng sự sạch sẽ</h2>
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