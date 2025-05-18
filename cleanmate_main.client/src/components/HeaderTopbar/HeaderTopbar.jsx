import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userImage from '../../images/user-image.png'


const HeaderTopbar = () => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const navigateTo = (path) => {
        setShowDropdown(false);
        navigate(path);
    };
    return (
        <div className="topbar">
            <div className="container">
                <div className="row">
                    <div className="col col-lg-6 col-md-5 col-sm-12 col-12">
                        <div className="contact-intro">
                            <ul>
                                <li><i className="fi ti-location-pin"></i>Hòa Lạc, Hà Nội, Việt Nam</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col col-lg-6 col-md-7 col-sm-12 col-12">
                        <div className="row">
                            <div className="contact-info col col-lg-6 col-md-7 col-sm-12 col-12">
                                <ul>
                                    <li><Link to="/terms">Chính sách & Điều khoản</Link></li>
                                </ul>
                            </div>
                            {isLogin ?
                                (

                                    <div className="user-avatar col col-lg-6 col-md-5 col-sm-12 col-12" onClick={() => navigate('/profile')}>
                                        <img src={userImage} alt="Ảnh của bạn" />
                                        <div className="user-avatar-information">
                                            <p>Hoang Tien Dung</p>
                                        </div>
                                    </div>

                                ) : (
                                    <div className="login-cta col col-lg-6 col-md-5 col-sm-12 col-12 ">
                                        <button className="btn sign-in-btn" onClick={() => navigate("/login")}>Đăng nhập</button>
                                        <div className="dropdown-container">
                                            <button className="btn sign-up-btn" onClick={toggleDropdown}>
                                                Đăng ký
                                            </button>

                                            {showDropdown && (
                                                <div className="dropdown-menu show">
                                                    <div className="dropdown-item" onClick={() => navigateTo("/register/user")}>
                                                        Đăng ký người dùng
                                                    </div>
                                                    <div className="dropdown-item" onClick={() => navigateTo("/register/employee")}>
                                                        Đăng ký nhân viên
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderTopbar;