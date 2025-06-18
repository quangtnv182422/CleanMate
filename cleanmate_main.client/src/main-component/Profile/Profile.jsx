import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
import ReactLoading from 'react-loading';

const Profile = ({ handleTabChange }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cleaner, setCleaner] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(customer)

    const SubmitHandler = (e) => {
        e.preventDefault();
    }

    const getCleanerProfile = useCallback(async () => {
        if (!user || user?.roles?.[0] !== "Cleaner") return;
        try {
            setLoading(true);
            const res = await fetch(`/employeeprofile`, {
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setCleaner(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [user, setCleaner]);

    const getCustomerProfile = useCallback(async () => {
        if (!user || user?.roles?.[0] !== "Customer") return;
        try {
            setLoading(true);
            const res = await fetch(`/customerprofile`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setCustomer(data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi khi lấy thông tin khách hàng");
        } finally {
            setLoading(false);
        }
    }, [user, setCustomer]);


    useEffect(() => {
        getCleanerProfile();
        getCustomerProfile();
    }, [getCleanerProfile, getCustomerProfile])

    return (
        <Fragment>
            {loading && (
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '1000',
                }}>
                    <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
                </Box>
            )}
            {user?.roles?.[0] === "Customer" && (<Navbar />)}
            <div className="team-pg-area section-padding">
                <div className="container">
                    <div className="team-info-wrap">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="team-info-img">
                                    <img src={userImage} alt="avatar của bạn" />
                                </div>
                            </div>
                            {cleaner && (
                                <div className="col-lg-6">
                                    <div className="team-info-text">
                                        <h2>{cleaner?.fullName}</h2>
                                        <ul>
                                            <li>Tên người dùng: <span>{cleaner?.fullName}</span></li>
                                            <li>Phone:<span>{cleaner?.phoneNumber}</span></li>
                                            <li>Email:<span>{cleaner?.email}</span></li>
                                            <li>Kinh nghiệm:<span>{cleaner?.experienceYears === 0 ? "Chưa có kinh nghiệm" : `${cleaner?.experienceYears} năm`}</span></li>
                                            <li>Khu vực hoạt động:<span>{cleaner?.activeAreas}</span></li>
                                            <li>Ngân hàng: <span>{cleaner?.bankName}</span></li>
                                            <li>Số tài khoản: <span>{cleaner?.bankNo}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {customer && (
                                <div className="col-lg-6">
                                    <div className="team-info-text">
                                        <h2>{customer?.fullName}</h2>
                                        <ul>
                                            <li>Tên người dùng: <span>{customer?.fullName}</span></li>
                                            <li>Email:<span>{customer?.email}</span></li>
                                            {/*<li>Phone:<span>{user?.phoneNumber}</span></li>*/}
                                            {/*<li>Kinh nghiệm:<span>{cleaner?.experienceYears === 0 ? "Chưa có kinh nghiệm" : `${cleaner?.experienceYears} năm`}</span></li>*/}
                                            {/*<li>Khu vực hoạt động:<span>{cleaner?.activeAreas}</span></li>*/}
                                            {/*<li>Ngân hàng: <span>{cleaner?.bankName}</span></li>*/}
                                            {/*<li>Số tài khoản: <span>{cleaner?.bankNo}</span></li>*/}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {user?.roles?.[0] === "Cleaner" && (
                        <>
                            <div className="cleaner-wallet">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="cleaner-wallet-wrapper">
                                            <h3 style={{ color: '#1976D2' }}>Số dư tài khoản</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
                                                    {cleaner?.balance.toLocaleString()} VND
                                                </p>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleTabChange(null, 6)}
                                                    style={{ marginTop: '20px' }}
                                                >
                                                    Nạp tiền
                                                </Button>
                                            </div>
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
                                        <div className="wpo-contact-area ex-wiget">
                                            <h2>Liên hệ chúng tôi</h2>
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
                        </>
                    )}
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default Profile;
