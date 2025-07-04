﻿import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReactLoading from 'react-loading';
import Logo from '../../images/logo-transparent.png';

const SignUpPageUser = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };


    const [value, setValue] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
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

    const submitForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                setLoading(true);
                const response = await fetch('/Authen/registercustomer', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*', // Match curl
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: `${value.first_name} ${value.last_name}`, 
                        email: value.email,
                        phoneNumber: value.phone, 
                        password: value.password,
                        confirmPassword: value.confirm_password, 
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.errors && Array.isArray(data.errors)) {
                        // Display all errors in a single toast
                        throw new Error(data.errors.join('\n'));
                    }
                    throw new Error(data.message || 'Đăng ký thất bại.');
                }

                setValue({
                    first_name: '',
                    last_name: '',
                    phone: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                });
                validator.hideMessages();
                toast.success('Đăng ký tài khoản thành công!  Hãy xác thực Email của bạn');
                navigate('/login', {replace: true});
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            validator.showMessages();
            toast.error('Vui lòng kiểm tra lại các trường thông tin!');
            setError('Vui lòng kiểm tra lại các trường thông tin!');
        }
    };

    const textSecurityStyle = showPassword
        ? { WebkitTextSecurity: 'none' }
        : { WebkitTextSecurity: 'disc' };

    return (
        <div style={{ position: 'relative' }}>
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
            <Grid className="loginWrapper">
                <Grid className="loginForm">
                    <div className="logo" onClick={() => navigate('/home')}>
                        <img src={Logo} alt="Logo của hệ thống" />
                    </div>
                    <h2>Đăng ký</h2>
                    <p>Đăng ký tài khoản CleanMate của bạn</p>
                    <form onSubmit={submitForm}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className="inputOutline"
                                    fullWidth
                                    placeholder="Họ"
                                    value={value.first_name}
                                    variant="outlined"
                                    name="first_name"
                                    label="Họ"
                                    InputLabelProps={{ shrink: true }}
                                    onBlur={(e) => changeHandler(e)}
                                    onChange={(e) => changeHandler(e)}
                                />
                                {validator.message('first name', value.first_name, 'required|alpha_vn')}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className="inputOutline"
                                    fullWidth
                                    placeholder="Tên"
                                    value={value.last_name}
                                    variant="outlined"
                                    name="last_name"
                                    label="Tên"
                                    InputLabelProps={{ shrink: true }}
                                    onBlur={(e) => changeHandler(e)}
                                    onChange={(e) => changeHandler(e)}
                                />
                                {validator.message('last name', value.last_name, 'required|alpha_vn')}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="inputOutline"
                                    fullWidth
                                    placeholder="Số điện thoại"
                                    value={value.phone}
                                    variant="outlined"
                                    name="phone"
                                    label="Số điện thoại"
                                    InputLabelProps={{ shrink: true }}
                                    onBlur={(e) => changeHandler(e)}
                                    onChange={(e) => changeHandler(e)}
                                />
                                {validator.message('phone', value.phone, 'required|phone_vn')}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="inputOutline"
                                    fullWidth
                                    placeholder="E-mail"
                                    value={value.email}
                                    variant="outlined"
                                    name="email"
                                    label="E-mail"
                                    InputLabelProps={{ shrink: true }}
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
                                <FormControl sx={{ width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Xác nhận mật khẩu</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirm_password"
                                        value={value.confirm_password}
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
                                        label="Xác nhận mật khẩu"
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
                                {validator.message('confirm password', value.confirm_password, `required|password_match:${value.password}`)}
                            </Grid>
                            <Grid item xs={12}>
                                <Grid className="formFooter" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="subtitle1" color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
                                    <Button fullWidth className="cBtn cBtnLarge cBtnTheme" type="submit">
                                        Đăng ký
                                    </Button>
                                </Grid>
                                <p className="noteHelp">
                                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                                </p>
                            </Grid>
                        </Grid>
                    </form>
                    <div className="shape-img">
                        <i className="fi flaticon-honeycomb"></i>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SignUpPageUser;