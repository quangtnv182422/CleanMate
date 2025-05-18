import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import SimpleReactValidator from 'simple-react-validator';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../images/logo-transparent.png';

const SignUpPageUser = () => {
    const navigate = useNavigate();

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
                const response = await fetch('/Authen/registercustomer', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*', // Match curl
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: `${value.first_name}${value.last_name}`, // Combine first_name and last_name with a space
                        email: value.email,
                        phoneNumber: value.phone, // Include phone number
                        password: value.password,
                        confirmPassword: value.confirm_password, // Include confirm password
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
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
                toast.success('Đăng ký tài khoản thành công!');
                navigate('/login');
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            validator.showMessages();
            toast.error('Các mục không được để trống!');
        }
    };

    return (
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
                            <TextField
                                type="password"
                                className="inputOutline"
                                fullWidth
                                placeholder="Mật khẩu"
                                value={value.password}
                                variant="outlined"
                                name="password"
                                label="Mật khẩu"
                                InputLabelProps={{ shrink: true }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('password', value.password, 'required|strong_password')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                className="inputOutline"
                                fullWidth
                                placeholder="Xác nhận mật khẩu"
                                value={value.confirm_password}
                                variant="outlined"
                                name="confirm_password"
                                label="Xác nhận mật khẩu"
                                InputLabelProps={{ shrink: true }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('confirm password', value.confirm_password, `required|password_match:${value.password}`)}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formFooter">
                                <Button fullWidth className="cBtn cBtnLarge cBtnTheme" type="submit">
                                    Đăng ký
                                </Button>
                            </Grid>
                            <Grid className="loginWithSocial">
                                <Button className="facebook"><i className="fa fa-facebook"></i></Button>
                                <Button className="twitter"><i className="fa fa-twitter"></i></Button>
                                <Button className="linkedin"><i className="fa fa-linkedin"></i></Button>
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
    );
};

export default SignUpPageUser;