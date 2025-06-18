import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useParams } from 'react-router-dom'
import Team from '../../api/team';
import Footer from '../../components/footer/Footer'

const TeamSinglePage = (props) => {
    const { id } = useParams()

    const TeamDetails = Team.find(item => item.Id === id)

    const SubmitHandler = (e) => {
        e.preventDefault()
    }



    return (
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={TeamDetails.name} pagesub={TeamDetails.title} />
            <div className="team-pg-area section-padding">
                <div className="container">
                    <div className="team-info-wrap">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="team-info-img">
                                    <img src={TeamDetails.tImg} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="team-info-text">
                                    <h2>{TeamDetails.name}</h2>
                                    <ul>
                                        <li>Position: <span>Siniour Leader</span></li>
                                        <li>Practice Area:<span>{TeamDetails.title}</span></li>
                                        <li>Experience:<span>12 Years</span></li>
                                        <li>Address:<span>Millington, Ave, TN 38053</span></li>
                                        <li>Phone:<span>+00 568 746 987</span></li>
                                        <li>Email:<span>youremail@gmail.com</span></li>
                                        <li>Fax:<span>568 746 987</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="exprience-area">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="exprience-wrap">
                                    <h2>Kinh nghiệm của đội ngũ nhân viên CleanMate</h2>
                                    <p>Với nhiều năm hoạt động trong lĩnh vực vệ sinh và chăm sóc không gian sống, đội ngũ nhân viên của chúng tôi đã tích lũy được kinh nghiệm đa dạng trong việc xử lý nhiều loại công việc từ dọn nhà, vệ sinh công nghiệp đến dịch vụ định kỳ cho gia đình và văn phòng. Chúng tôi hiểu rằng mỗi không gian đều có những yêu cầu và thách thức riêng, vì vậy từng thành viên luôn tiếp cận công việc với tinh thần trách nhiệm, sự tỉ mỉ và chuyên nghiệp cao nhất.</p>
                                    <p>Không chỉ đơn thuần là làm sạch, chúng tôi luôn nỗ lực tạo ra môi trường sống và làm việc thoải mái, gọn gàng và an toàn cho khách hàng. Qua hàng trăm ca làm việc thực tế, đội ngũ đã học cách phối hợp hiệu quả, xử lý nhanh gọn những tình huống phát sinh, đồng thời giữ vững thái độ thân thiện và tôn trọng đối với từng khách hàng. Chính trải nghiệm thực tế và phản hồi tích cực từ khách hàng đã giúp chúng tôi không ngừng hoàn thiện chất lượng dịch vụ từng ngày.</p>
                                </div>
                                {/*<div className="at-progress">*/}
                                {/*    <div className="row">*/}
                                {/*        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">*/}
                                {/*            <div className="progress yellow">*/}
                                {/*                <span className="progress-left">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <span className="progress-right">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <div className="progress-value">25+</div>*/}
                                {/*                <div className="progress-name"><span>Award</span></div>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">*/}
                                {/*            <div className="progress blue">*/}
                                {/*                <span className="progress-left">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <span className="progress-right">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <div className="progress-value">90%</div>*/}
                                {/*                <div className="progress-name"><span>Happy Client</span></div>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">*/}
                                {/*            <div className="progress pink">*/}
                                {/*                <span className="progress-left">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <span className="progress-right">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <div className="progress-value">95%</div>*/}
                                {/*                <div className="progress-name"><span>Project Done</span></div>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">*/}
                                {/*            <div className="progress green">*/}
                                {/*                <span className="progress-left">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <span className="progress-right">*/}
                                {/*                    <span className="progress-bar"></span>*/}
                                {/*                </span>*/}
                                {/*                <div className="progress-value">1000+</div>*/}
                                {/*                <div className="progress-name"><span>Project</span></div>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="education-area ex-wiget">
                                    <h2>Trình độ</h2>
                                    <ul>
                                        <li>Đội ngũ nhân viên được đào tạo bài bản về các quy trình vệ sinh chuyên nghiệp, từ vệ sinh gia đình đến dọn dẹp công nghiệp và xử lý các khu vực đặc thù.</li>
                                        <li>Thành thạo trong việc sử dụng các thiết bị, máy móc hiện đại và hóa chất phù hợp cho từng loại bề mặt nhằm đảm bảo hiệu quả làm sạch tối ưu.</li>
                                        <li>Luôn cập nhật kiến thức và kỹ năng mới thông qua các buổi tập huấn định kỳ, đảm bảo theo kịp yêu cầu ngày càng cao từ khách hàng.</li>
                                        <li>Sở hữu kỹ năng giao tiếp lịch sự, biết cách ứng xử chuyên nghiệp và thân thiện với khách hàng trong mọi tình huống.</li>
                                    </ul>
                                </div>
                                {/*<div className="language-area ex-wiget">*/}
                                {/*    <h2>Language</h2>*/}
                                {/*    <ul>*/}
                                {/*        <li>French(fluent), English (fluent), Greek , chinese.</li>*/}
                                {/*    </ul>*/}
                                {/*</div>*/}
                                <div className="wpo-contact-area ex-wiget">
                                    <h2>Liên hệ chúng tôi</h2>
                                    <div className="quote-form">
                                        <form onSubmit={SubmitHandler}>
                                            <div className="form-group half-col">
                                                <input type="text" className="form-control" placeholder="Họ và tên:" name="name" />
                                            </div>
                                            <div className="form-group half-col">
                                                <input type="email" className="form-control" placeholder="Email:" name="email" />
                                            </div>
                                            <div className="form-group half-col">
                                                <input type="text" className="form-control" placeholder="Tiêu đề:" name="subject" />
                                            </div>
                                            <div className="form-group half-col">
                                                <input type="text" className="form-control" placeholder="Địa chỉ:" name="address" />
                                            </div>
                                            <div className="form-group full-col">
                                                <textarea className="form-control" name="note" placeholder="Điều bạn muốn nhắn nhủ..."></textarea>
                                            </div>
                                            <div className="form-group full-col">
                                                <button className="btn theme-btn" type="submit"><i className="fa fa-angle-double-right" aria-hidden="true"></i> Gửi thông tin</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
            <Scrollbar />
        </Fragment>
    )
};
export default TeamSinglePage;
