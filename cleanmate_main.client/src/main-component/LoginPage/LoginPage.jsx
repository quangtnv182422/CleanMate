﻿import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { BookingContext } from '../../context/BookingProvider';
import {
    Grid,
    TextField,
    FormControlLabel,
    FormControl,
    InputLabel, 
    OutlinedInput,
    InputAdornment,
    IconButton,
    Checkbox,
    Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Logo from '../../images/logo-transparent.png';
import './style.scss';




const LoginPage = (props) => {

    const push = useNavigate();
    const { refreshAuth } = useContext(BookingContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const [value, setValue] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [validator] = React.useState(
        new SimpleReactValidator({
            className: 'errorMessage',
            messages: {
                required: 'Trường này là bắt buộc.',
                email: 'Địa chỉ email không hợp lệ.',
                min: 'Giá trị phải có ít nhất :min ký tự.',
                max: 'Giá trị không được vượt quá :max ký tự.',
                numeric: 'Chỉ được nhập số.',
                alpha: 'Chỉ được nhập chữ cái.',
                alpha_num: 'Chỉ được nhập chữ và số.',
                phone: 'Số điện thoại không hợp lệ.',
            },
            validators: {
                alpha_vn: {
                    message: 'Chỉ được nhập chữ cái (bao gồm cả tiếng Việt có dấu).',
                    rule: (val) => /^[A-Za-zÀ-ỹà-ỹ\s]+$/.test(val),
                },
                phone_vn: {
                    message: 'Số điện thoại phải có đúng 10 chữ số.',
                    rule: (val) => /^0\d{9}$/.test(val),
                },
                cccd: {
                    message: 'Căn cước công dân phải có đúng 12 chữ số.',
                    rule: (val) => /^\d{12}$/.test(val),
                },
                strong_password: {
                    message:
                        'Mật khẩu phải có ít nhất 6 ký tự, bao gồm số và ký tự đặc biệt.',
                    rule: (val) =>
                        /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/.test(val),
                },
                password_match: {
                    message: 'Xác nhận mật khẩu không khớp.',
                    rule: (val, params) => val === params[0],
                    required: true,
                },
            },
        })
    );

    const changeHandler = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        validator.showMessages();
    };

    const rememberHandler = () => {
        setValue({ ...value, remember: !value.remember });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (validator.allValid()) {
            try {
                const response = await fetch('/Authen/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // <-- rất quan trọng để gửi cookie đi
                    body: JSON.stringify({
                        email: value.email,
                        password: value.password,
                    }),
                });

                if (response.ok) {
                    toast.success('Bạn đã đăng nhập thành công vào CleanMate!');

                    // Gọi refreshAuth để fetch lại thông tin người dùng
                    await refreshAuth();

                    // Lấy thông tin người dùng
                    const userInfoRes = await fetch('/Authen/me', { credentials: 'include' });
                    const userInfo = await userInfoRes.json();

                    const roles = userInfo.roles || [];

                    if (roles.includes("Cleaner")) {
                        push("/public-work");
                    } else if (roles.includes("Customer")) {
                        push("/home");
                    } else if (roles.includes("Admin")) {
                        push("/admin/dashboard");
                    } else {
                        push('/home')
                    }
                } else {
                    const error = await response.json();
                    toast.error(`Đăng nhập thất bại: ${error.message}`);
                }
            } catch (err) {
                console.error(err);
                toast.error('Lỗi kết nối đến máy chủ!');
            }
        } else {
            validator.showMessages();
            toast.error('Vui lòng kiểm tra lại các trường thông tin!');
        }
    };

    const textSecurityStyle = showPassword
        ? { WebkitTextSecurity: 'none' }
        : { WebkitTextSecurity: 'disc' };


    return (
        <Grid className="loginWrapper">
            <Grid className="loginForm">
                <div className="logo" onClick={() => push('/home')}>
                    <img src={Logo} alt="Logo của hệ thống" />
                </div>
                <h2>Đăng nhập</h2>
                <p>Đăng nhập vào tài khoản của bạn</p>
                <form onSubmit={submitForm}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="E-mail"
                                value={value.email}
                                variant="outlined"
                                name="email"
                                label="E-mail"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('email', value.email, 'required|email')}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={value.password}
                                    onBlur={(e) => changeHandler(e)}
                                    onChange={(e) => changeHandler(e)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Mật khẩu"
                                    sx={{
                                        input: {
                                            '&::-ms-reveal': { display: 'none' },
                                            '&::-ms-clear': { display: 'none' },
                                            '&::-webkit-credentials-auto-fill-button': { display: 'none' },
                                            '&::-webkit-textfield-decoration-container': { display: 'none' },
                                            ...textSecurityStyle,
                                        }
                                    }}
                                />
                            </FormControl>
                            {validator.message('password', value.password, 'required|strong_password')}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formAction">
                                <FormControlLabel
                                    control={<Checkbox checked={value.remember} onChange={rememberHandler} />}
                                    label="Nhớ mật khẩu"
                                />
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </Grid>
                            <Grid className="formFooter">
                                <Button fullWidth className="cBtnTheme" type="submit">Đăng nhập</Button>
                            </Grid>
                            <p className="noteHelp">Bạn chưa có tài khoản? <Link to="/register/user">Đăng ký tài khoản ngay</Link>
                            </p>
                        </Grid>
                    </Grid>
                </form>
                <div className="shape-img">
                    <i className="fi flaticon-honeycomb"></i>
                </div>
            </Grid>
        </Grid>
    )
};

export default LoginPage;