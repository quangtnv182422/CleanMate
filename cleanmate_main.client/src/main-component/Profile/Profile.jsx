import React, { Fragment } from 'react';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Team from '../../api/team';
import Footer from '../../components/footer/Footer'
import userImage from '../../images/user-image.png'
import useAuth from '../../hooks/useAuth';
const Profile = (props) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    
    const SubmitHandler = (e) => {
        e.preventDefault();
    }

    return (
        <Fragment>
            {user?.roles?.[0] === "Customer" && (<Navbar />)}
            <div className="team-pg-area section-padding">
                <div className="container">
                    <div className="team-info-wrap">
                        <Button variant="text" sx={{ fontSize: '16px' }} onClick={() => navigate('/public-work')} startIcon={<KeyboardBackspaceIcon /> }>Quay lại</Button>
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="team-info-img">
                                    <img src={userImage} alt="avatar của bạn" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="team-info-text">
                                    <h2>{user?.fullName}</h2>
                                    <ul>
                                        <li>Tên người dùng: <span>{user?.fullName}</span></li>
                                        <li>Email:<span>{user?.email}</span></li>
                                        {/*<li>Experience:<span>12 Years</span></li>*/}
                                        {/*<li>Address:<span>Millington, Ave, TN 38053</span></li>*/}
                                        {/*<li>Phone:<span>+00 568 746 987</span></li>*/}
                                        {/*<li>Email:<span>youremail@gmail.com</span></li>*/}
                                        {/*<li>Fax:<span>568 746 987</span></li>*/}
                                        {user?.roles?.[0] === "Cleaner" && (
                                            <>
                                                <li>Ngân hàng: <span>{user?.bankName}</span></li>
                                                <li>Số tài khoản: <span>{user?.bankNo}</span></li>
                                                <li>Ngân hàng: <span>{user?.bankName}</span></li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {user?.roles?.[0] === "Cleaner" && (
                        <div className="exprience-area">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="exprience-wrap">
                                        <h2>Personal Experience</h2>
                                        <p>The purpose of lorem ipsum is to create a natural looking block oftext (sentence, paragraph, page, etc.) that doesn't distract from thelayout. A practice not without controversy, laying out pages withmeaningless filler text can be very useful when the focus is meantto be on design, not content.There are many variations of passages of Lorem Ipsum available.</p>
                                        <p>But the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text generators on the Internet tend to repeat.</p>
                                    </div>
                                    <div className="at-progress">
                                        <div className="row">
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">
                                                <div className="progress yellow">
                                                    <span className="progress-left">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <span className="progress-right">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <div className="progress-value">25+</div>
                                                    <div className="progress-name"><span>Award</span></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">
                                                <div className="progress blue">
                                                    <span className="progress-left">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <span className="progress-right">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <div className="progress-value">90%</div>
                                                    <div className="progress-name"><span>Happy Client</span></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">
                                                <div className="progress pink">
                                                    <span className="progress-left">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <span className="progress-right">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <div className="progress-value">95%</div>
                                                    <div className="progress-name"><span>Project Done</span></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 custom-grid">
                                                <div className="progress green">
                                                    <span className="progress-left">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <span className="progress-right">
                                                        <span className="progress-bar"></span>
                                                    </span>
                                                    <div className="progress-value">1000+</div>
                                                    <div className="progress-name"><span>Project</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="education-area ex-wiget">
                                        <h2>Education</h2>
                                        <ul>
                                            <li>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</li>
                                            <li>If you are going to use a passage of Lorem Ipsum.</li>
                                            <li>Very popular during the Renaissance. </li>
                                            <li>Many desktop publishing packages and web page editors now.</li>
                                        </ul>
                                    </div>
                                    <div className="language-area ex-wiget">
                                        <h2>Language</h2>
                                        <ul>
                                            <li>French(fluent), English (fluent), Greek , chinese.</li>
                                        </ul>
                                    </div>
                                    <div className="wpo-contact-area ex-wiget">
                                        <h2>Contact Me</h2>
                                        <div className="quote-form">
                                            <form onSubmit={SubmitHandler}>
                                                <div className="form-group half-col">
                                                    <input type="text" className="form-control" placeholder="Name:" name="name" />
                                                </div>
                                                <div className="form-group half-col">
                                                    <input type="email" className="form-control" placeholder="Email:" name="email" />
                                                </div>
                                                <div className="form-group half-col">
                                                    <input type="text" className="form-control" placeholder="Subject:" name="subject" />
                                                </div>
                                                <div className="form-group half-col">
                                                    <input type="text" className="form-control" placeholder="Your Address:" name="address" />
                                                </div>
                                                <div className="form-group full-col">
                                                    <textarea className="form-control" name="note" placeholder="Description..."></textarea>
                                                </div>
                                                <div className="form-group full-col">
                                                    <button className="btn theme-btn" type="submit"><i className="fa fa-angle-double-right" aria-hidden="true"></i> Get In Touch</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default Profile;
