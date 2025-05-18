import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.get(`https://yourapi.com/api/account/confirm-email`, {
                    params: {
                        userId,
                        token,
                    },
                });

                // ✅ Nếu xác thực thành công, thông báo và chuyển sang trang login
                toast.success('Xác nhận email thành công! Hãy đăng nhập.');
                navigate('/login');
            } catch (error) {
                // ❌ Nếu lỗi, thông báo
                toast.error('Xác nhận email thất bại! Mã xác nhận không hợp lệ hoặc đã hết hạn.');
                navigate('/login');
            }
        };

        if (userId && token) {
            confirmEmail();
        } else {
            toast.error('Thiếu thông tin xác nhận!');
            navigate('/login');
        }
    }, [userId, token, navigate]);

    return null; 
};

export default EmailConfirmation;
