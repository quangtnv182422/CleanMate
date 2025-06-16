import React, { useState } from 'react';
import {
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    TextField,
    Button
} from "@mui/material";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const ChangePassword = () => {
    const push = useNavigate()

    const [value, setValue] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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
                message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
                rule: (val, params) => val !== params[0],
                required: true,
            },
        },
    }));

    const submitForm = async (e) => {
        e.preventDefault();

        if (validator.allValid()) {
            try {
                push('/loading', { replace: true })
                // Gửi request tới API quên mật khẩu
                const response = await axios.post('/Authen/change-password', {
                    currentPassword: value.currentPassword, 
                    newPassWord: value.newPassword,
                });

                if (response.status === 200) {
                    toast.success('Đã đổi mật khẩu thành công.');
                    push('/login', { replace: true })
                } else {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
                    push('/change-password', { replace: true })         
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    toast.error('Lỗi khi đổi mật khẩu. Vui lòng thử lại.');
                    push('/change-password', { replace: true })    
                } else {
                    toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
                    push('/change-password', { replace: true })    
                }
            }
        } else {
            validator.showMessages();
            toast.error('Vui lòng nhập mật khẩu khác mật khẩu cũ.');
        }
    };

    return (
        <Grid className="loginWrapper">

            <Grid className="loginForm">
                <h2>Đặt lại mật khẩu</h2>
                <p>Khởi tạo lại mật khẩu của bạn</p>
                <form onSubmit={submitForm}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={value.currentPassword}
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
                                    label="Mật khẩu cũ"
                                    sx={{
                                        input: {
                                            '&::-ms-reveal': { display: 'none' },
                                            '&::-ms-clear': { display: 'none' },
                                            '&::-webkit-credentials-auto-fill-button': { display: 'none' },
                                            '&::-webkit-textfield-decoration-container': { display: 'none' },
                                        }
                                    }}
                                />
                            </FormControl>
                            {validator.message('currentPassword', value.currentPassword, 'required|strong_password')}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Xác nhận mật khẩu</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={value.newPassword}
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
                                        }
                                    }}
                                />
                            </FormControl>
                            {validator.message('newPassword', value.newPassword, `required|strong_password|password_match:${value.currentPassword}`)}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formFooter">
                                <Button fullWidth className="cBtn cBtnLarge cBtnTheme" type="submit">Đổi mật khẩu</Button>
                            </Grid>
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


export default ChangePassword;