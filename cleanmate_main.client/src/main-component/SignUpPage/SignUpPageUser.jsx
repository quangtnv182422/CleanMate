import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../../images/logo-transparent.png';


const SignUpPageUser = (props) => {

    const push = useNavigate()

    const [value, setValue] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const changeHandler = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        validator.showMessages();
    };

    const [validator] = React.useState(new SimpleReactValidator({
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
            // thêm các quy tắc khác nếu bạn sử dụng
        }
    }));


    const submitForm = (e) => {
        e.preventDefault();
        if (validator.allValid()) {
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
            push('/login');
        } else {
            validator.showMessages();
            toast.error('Các mục không được để trống!');
        }
    };
    return (
        <Grid className="loginWrapper">

            <Grid className="loginForm">
                <div className="logo" onClick={() => push('/home')}>
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
                                value={value.firstName}
                                variant="outlined"
                                name="firstName"
                                label="Họ"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('full name', value.first_name, 'required|alpha')}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Tên"
                                value={value.lastName}
                                variant="outlined"
                                name="lastName"
                                label="Tên"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('full name', value.last_name, 'required|alpha')}
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('full name', value.phone, 'required|alpha')}
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('email', value.email, 'required|email')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Mật khẩu"
                                value={value.password}
                                variant="outlined"
                                name="password"
                                label="Mật khẩu"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('password', value.password, 'required')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Xác nhận mật khẩu"
                                value={value.password}
                                variant="outlined"
                                name="confirm_password"
                                label="Xác nhận mật khẩu"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('confirm password', value.confirm_password, `in:${value.password}`)}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formFooter">
                                <Button fullWidth className="cBtn cBtnLarge cBtnTheme" type="submit">Đăng ký</Button>
                            </Grid>
                            <Grid className="loginWithSocial">
                                <Button className="facebook"><i className="fa fa-facebook"></i></Button>
                                <Button className="twitter"><i className="fa fa-twitter"></i></Button>
                                <Button className="linkedin"><i className="fa fa-linkedin"></i></Button>
                            </Grid>
                            <p className="noteHelp">Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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

export default SignUpPageUser;