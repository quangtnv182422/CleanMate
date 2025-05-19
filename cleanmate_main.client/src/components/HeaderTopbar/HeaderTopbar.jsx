import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userImage from '../../images/user-image.png'
import useAuth from '../../hooks/useAuth';


const HeaderTopbar = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const navigateTo = (path) => {
        setShowDropdown(false);
        navigate(path);
    };

    const handleLogout = () => {
        fetch('/Authen/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            window.location.reload(); // hoặc gọi lại API /me
        });
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.user-avatar')) {
            setShowDropdown(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (loading) return null; // Hoặc loading spinner

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
                            {user ? (
                                <div className="user-avatar col col-lg-6 col-md-5 col-sm-12 col-12" onClick={toggleDropdown}>
                                    <img src={userImage} alt="Ảnh của bạn" />
                                    <div className="user-avatar-information">
                                        <p>{user.fullName}</p> {/* hoặc user.name nếu backend trả về */}
                                    </div>
                                    {showDropdown && (
                                        <div className="user-dropdown-menu">
                                            <div className="dropdown-item" onClick={() => navigateTo("/profile")}>
                                                Hồ sơ cá nhân
                                            </div>
                                            <div className="dropdown-item" onClick={() => navigateTo("/history")}>
                                                Lịch sử giao dịch
                                            </div>
                                            <div className="dropdown-item" onClick={handleLogout}>
                                                Đăng xuất
                                            </div>
                                        </div>
                                    )}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default HeaderTopbar;