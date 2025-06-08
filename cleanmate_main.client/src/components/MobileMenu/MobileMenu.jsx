import React, { useState } from 'react';
import { ListItem, ListItemIcon, Box, Avatar, Typography, Button } from '@mui/material';
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PaidIcon from '@mui/icons-material/Paid';
import userAvatar from '../../images/user-image.png';
import './style.css';
import useAuth from '../../hooks/useAuth';

const buttonStyle = {
    width: '90%',
    margin: '0 8px',
}

const menus = [
    {
        id: 1,
        title: 'Trang chủ',
        link: '/home',
        icon: <HomeIcon />,
    },
    {
        id: 2,
        title: 'Nạp ví CleanMate',
        link: '/coin/deposit',
        icon: <PaidIcon />,
    },
    {
        id: 3,
        title: 'Về chúng tôi',
        link: '/about',
        icon: <InfoIcon />,
    },
    {
        id: 4,
        title: 'Dịch vụ',
        link: '/service',
        icon: <BuildIcon />,
    },
    {
        id: 5,
        title: 'Lịch sử đặt dịch vụ',
        link: '/order-history',
        icon: <HistoryIcon />,
    },
    {
        id: 6,
        title: 'Blog',
        link: '/blog',
        icon: <ArticleIcon />,
    },
    {
        id: 7,
        title: 'Liên hệ',
        link: '/contact',
        icon: <ContactMailIcon />,
    },
]


const MobileMenu = () => {
    const { user } = useAuth();
    const [openId, setOpenId] = useState(0);
    const [openMenu, setOpenMenu] = useState(false);
    const [menuActive, setMenuState] = useState(false);
    const navigate = useNavigate();

    const handleToggleMenu = () => setOpenMenu(!openMenu);

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const handleLogout = () => {
        fetch('/Authen/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            window.location.href = "/home"; // hoặc gọi lại API /me
        });
    };

    return (
        <div>
            <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>
                {user && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            px: 2,
                            py: 2,
                            borderBottom: '1px solid #ddd',
                        }}
                        onClick={() => navigate("/profile")}
                    >
                        <Avatar src={userAvatar} alt={user?.fullName} sx={{ width: 40, height: 40 }} />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {user?.fullName}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <ul className="responsivemenu">
                    {menus.map((item, mn) => {
                        const isProtected = item.link === '/order-history';
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: 1 }}>
                                <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>{item.icon}</ListItemIcon>
                                <ListItem className={item.id === openId ? 'active' : null} key={mn}>
                                    {isProtected ? (
                                        <Box
                                            onClick={() => {
                                                if (!user) {
                                                    toast.error("Vui lòng đăng nhập để xem lịch sử đặt dịch vụ");
                                                    navigate("/login");
                                                } else {
                                                    navigate(item.link);
                                                }
                                            }}
                                        >
                                            <NavLink exact activeClassName="active" style={{ fontSize: '16px', textDecoration: 'none', color: '#222', padding: '10px 2px' }}>{item.title}</NavLink>
                                        </Box>
                                    ) : (
                                        <NavLink exact activeClassName="active" style={{ fontSize: '16px', textDecoration: 'none', color: '#222', padding: '10px 2px' }}
                                            to={item.link}>{item.title}
                                        </NavLink>
                                    )}
                                </ListItem>
                            </Box>
                        )
                    })}
                </ul>
                {user ? (
                    <Box sx={{ width: '100%', mt: 5 }}>
                        <button
                            className="btn"
                            style={{ width: '90%', margin: '0 8px' }}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', mt: 5 }}>
                        <button
                            className="btn"
                            style={{
                                ...buttonStyle,
                                border: '1px solid #1565C0',
                                color: '#1565C0',
                                backgroundColor: '#f9f9f9'
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="btn"
                            style={{
                                ...buttonStyle,
                                marginTop: '5px',
                                color: '#fff',
                                backgroundColor: '#FBC11B'
                            }}
                            onClick={handleToggleMenu}
                        >
                            Đăng ký
                        </button>
                    </Box>
                )}
                {openMenu && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '500px',
                            left: '6px', // Hiển thị menu bên phải nút
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            zIndex: 999
                        }}
                    >
                        <button
                            className="btn"
                            style={{
                                width: '94%',
                                marginBottom: '5px',
                                backgroundColor: '#007bff',
                                color: 'white'
                            }}
                            onClick={() => navigate('/register/user')}
                        >
                            Đăng ký người dùng
                        </button>

                        <button
                            className="btn"
                            style={{
                                width: '94%',
                                backgroundColor: '#28a745',
                                color: 'white'
                            }}
                            onClick={() => navigate('/register/employee')}
                        >
                            Đăng ký nhân viên
                        </button>
                    </div>
                )}
            </div>

            <div className="showmenu" onClick={() => setMenuState(!menuActive)}>
                <button type="button" className="navbar-toggler open-btn">
                    <span className="icon-bar first-angle"></span>
                    <span className="icon-bar middle-angle"></span>
                    <span className="icon-bar last-angle"></span>
                </button>
            </div>
            
        </div>
    )
}

export default MobileMenu;