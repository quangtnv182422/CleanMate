import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userImage from '../../images/user-image.png'
import useAuth from '../../hooks/useAuth';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { AuthContext } from '../../context/AuthContext';

const HeaderTopbar = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [coin, setCoin] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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
            window.location.href = '/home'; // hoặc gọi lại API /me
        });
    };

    useEffect(() => {
        const getCoin = async () => {
            try {
                const response = await fetch('/wallet/get-wallet', {
                    method: 'GET',
                    credentials: 'include',
                });

                const walletData = await response.json();
                setCoin(walletData?.balance);
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };

        getCoin();
    }, []);

    const formatCoin = (coin) => {
        if (coin == null || isNaN(coin)) return '0';
        return coin.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
                    <div className="col col-lg-4 col-md-5 col-sm-12 col-12">
                        <div className="contact-intro">
                            <ul>
                                <li><i className="fi ti-location-pin"></i>Chỉ khả dụng ở Hòa Lạc, Hà Nội, Việt Nam</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col col-lg-8 col-md-7 col-sm-12 col-12">
                        <div className="row">
                            <div className="contact-info col col-lg-7 col-md-7 col-sm-12 col-12">
                                <ul style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    <li style={{cursor: 'pointer'}} onClick={() => navigate('/terms') }>Chính sách & Điều khoản</li>
                                    {user && (
                                        <li>Ví CleanMate: {formatCoin(coin)}</li>
                                    )}
                                </ul>
                            </div>
                            {user ? (
                                <div className="user-avatar-container col col-lg-5 col-md-5 col-sm-12 col-12">
                                    <div className="user-avatar" onClick={toggleDropdown} ref={dropdownRef}>
                                        <img src={userImage} alt="Ảnh của bạn" />
                                        <div className="user-avatar-information">
                                            <p>{user.fullName}</p>
                                        </div>
                                        {showDropdown && (
                                            <div className="user-dropdown-menu">
                                                <div className="user-profile">
                                                    <div className="avatar">
                                                        <img src={userImage} alt="Avatar" />
                                                    </div>
                                                    <div className="user-info">
                                                        <div className="name-row">
                                                            <span className="user-name">{user.fullName}</span>
                                                        </div>
                                                        <span className="user-email">{user.email}</span>
                                                    </div>
                                                </div>

                                                <div className="user-personal-page">
                                                    <div className="dropdown-item" onClick={() => navigateTo("/profile")}>
                                                        <AccountCircleOutlinedIcon size="small" />
                                                        Hồ sơ cá nhân
                                                    </div>
                                                    <div className="dropdown-item" onClick={() => navigateTo("/order-history")}>
                                                        <CleaningServicesOutlinedIcon size="small" />
                                                        Lịch sử đặt dịch vụ
                                                    </div>
                                                </div>
                                                <div className="cleanmate-wallet">
                                                    <div className="cleanmate-wallet-title">
                                                        <AccountBalanceWalletOutlinedIcon size="small" />
                                                        Ví CleanMate
                                                    </div>
                                                    <div className="cleanmate-wallet-content">
                                                        <p className="cleanmate-wallet-balance">Số dư hiện tại: {formatCoin(coin)}</p>
                                                        <div className="cleanmate-wallet-button">
                                                            {/*<button className="btn withdraw-button" style={{}} onClick={() => navigate('/coin/withdraw')}>Rút Tiền</button>*/}
                                                            <button className="btn deposit-button" onClick={() => navigate('/coin/deposit')}>Nạp Tiền</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dropdown-item logout-btn" onClick={handleLogout}>
                                                    <LogoutOutlinedIcon size="small" />
                                                    Đăng xuất
                                                </div>
                                            </div>

                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="login-cta col col-lg-5 col-md-5 col-sm-12 col-12 ">
                                    <button className="btn sign-in-btn" onClick={() => navigate("/login")}>Đăng nhập</button>
                                    <div className="dropdown-container" ref={dropdownRef}>
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