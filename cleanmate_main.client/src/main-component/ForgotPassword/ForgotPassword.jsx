import React, { useState } from 'react';
import {
    Grid, Button, TextField, Typography, Box
} from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from 'react-loading';
import axios from 'axios';

const ForgotPassword = (props) => {

    const push = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [value, setValue] = useState({
        email: '',
    });

    const changeHandler = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        setError(null);
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

    const submitForm = async (e) => {
        e.preventDefault();

        if (validator.allValid()) {
            try {
                setLoading(true);
                // Gửi request tới API quên mật khẩu
                const response = await axios.post('/Authen/forgot-password', {
                    email: value.email,
                });

                if (response.status === 200) {
                    toast.success('Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.');
                    push('/login', { replace: true })
                } else {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
                    setError('Đã xảy ra lỗi. Vui lòng thử lại.');
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    toast.error('Email không tồn tại trong hệ thống.');
                    setError('Email không tồn tại trong hệ thống.');
                } else if (error.response?.status === 400) {
                    toast.error("Email không tồn tại hoặc chưa được xác thực.");
                    setError("Email không tồn tại hoặc chưa được xác thực.");
                } else {
                    toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
                    setError('Lỗi máy chủ. Vui lòng thử lại sau.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            validator.showMessages();
            toast.error('Vui lòng nhập địa chỉ email hợp lệ.');
            setError('Vui lòng nhập địa chỉ email hợp lệ.');
        }
    };
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
                    <h2>Quên mật khẩu</h2>
                    <p>Khởi tạo lại mật khẩu của bạn</p>
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
                                <Grid className="formFooter" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="subtitle1" color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
                                    <Button fullWidth className="cBtn cBtnLarge cBtnTheme" type="submit">Gửi lại mật khẩu</Button>
                                </Grid>
                                <p className="noteHelp">Bạn đã có tài khoản? <Link to="/login">Quay lại đăng nhập</Link>
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
    )
};

export default ForgotPassword;