import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../../images/logo-transparent.png';

import './style.scss';



const LoginPage = (props) => {

    const push = useNavigate()

    const [value, setValue] = useState({
        email: 'user@gmail.com',
        password: '123456',
        remember: false,
    });

    const changeHandler = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        validator.showMessages();
    };

    const rememberHandler = () => {
        setValue({ ...value, remember: !value.remember });
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
        }
    }));



    const submitForm = (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            setValue({
                email: '',
                password: '',
                remember: false
            });
            validator.hideMessages();

            const userRegex = /^user+.*/gm;
            const email = value.email;

            if (email.match(userRegex)) {
                toast.success('Bạn đã đăng nhập thành công vào CleanMate !');
                push('/home');
            }
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
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Mật khẩu"
                                value={value.password}
                                variant="outlined"
                                name="password"
                                type="password"
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
                            <Grid className="loginWithSocial">
                                <Button className="facebook"><i className="fa fa-facebook"></i></Button>
                                <Button className="twitter"><i className="fa fa-twitter"></i></Button>
                                <Button className="linkedin"><i className="fa fa-linkedin"></i></Button>
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