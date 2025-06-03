import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const url = new URL('/Authen/confirm-email', window.location.origin);
                url.searchParams.append('userId', userId);
                url.searchParams.append('token', token);

                const response = await fetch(url, {
                    method: 'GET',
                });

                if (response.ok) {
                    toast.success('Xác nhận email thành công! Hãy đăng nhập.');
                    navigate('/login');
                }
            } catch (error) {
                toast.error('Đã xảy ra lỗi kết nối khi xác nhận email.');
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
