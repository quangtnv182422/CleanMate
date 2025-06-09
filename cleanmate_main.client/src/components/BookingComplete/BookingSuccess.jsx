import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import classNames from 'classnames/bind';
import styles from './style.module.scss';

const cx = classNames.bind(styles);

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const deposit = searchParams.get('deposit');
    const success = searchParams.get('success') === 'true';
    const bookingDetails = {
        date: searchParams.get('date') || 'N/A',
        time: searchParams.get('time') || 'N/A',
        service: searchParams.get('service') || 'N/A',
        cleaner: searchParams.get('cleaner') || 'N/A',
        payment: searchParams.get('payment') || 'N/A',
    };

    const depositDetails = {
        date: searchParams.get('date') || 'N/A',
        coin: searchParams.get('coin') || 'N/A',
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#f0f4f8',
            }}
        >
            <Card sx={{ width: 400, textAlign: 'center', p: 3 }}>
                <CardContent>
                    {deposit && deposit === "success" ? (
                        <>
                            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Bạn đã nạp tiền thành công!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Cảm ơn vì đã nạp tiền!
                            </Typography>
                            <Box sx={{ mt: 2, textAlign: 'left' }}>
                                <Typography variant="body2">Ngày: {depositDetails.date}</Typography>
                                <Typography variant="body2">Số tiền đã nạp: {depositDetails.coin}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                className={cx('view-booking-details-button')}
                                onClick={() => navigate('/coin/deposit')}
                                sx={{ mt: 3, mr: 1 }}
                            >
                                Nạp thêm
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/home')}
                                sx={{ mt: 3 }}
                            >
                                Quay về trang chủ
                            </Button>
                        </>
                    ) : success ? (
                        <>
                            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Bạn đã đặt dịch vụ thành công!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Dịch vụ của bạn đặt đã được xác nhận. Cảm ơn vì đã chọn chúng tôi!
                            </Typography>
                            <Box sx={{ mt: 2, textAlign: 'left' }}>
                                <Typography variant="body2"><span className={cx('booking-success-title')}>Ngày:</span> {bookingDetails.date}</Typography>
                                <Typography variant="body2"><span className={cx('booking-success-title')}>Thời gian:</span> {bookingDetails.time}</Typography>
                                <Typography variant="body2"><span className={cx('booking-success-title')}>Dịch vụ:</span> {bookingDetails.service}</Typography>
                                <Typography variant="body2"><span className={cx('booking-success-title')}>Người chịu trách nhiệm dọn dẹp:</span> {bookingDetails.cleaner}</Typography>
                                <Typography variant="body2"><span className={cx('booking-success-title')}>Tổng tiền phải thanh toán:</span> {bookingDetails.payment}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                className={cx('view-booking-details-button')}
                                onClick={() => navigate('/booking-details', {
                                    state: bookingDetails
                                })} // Adjust route as needed
                                sx={{ mt: 3, mr: 1 }}
                            >
                                Xem chi tiết đơn hàng
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/home')}
                                sx={{ mt: 3 }}
                            >
                                Quay về trang chủ
                            </Button>
                        </>
                    ) : (
                        <>
                            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'red', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Thanh toán không thành công
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/payment')} // Redirect to payment page
                                sx={{ mt: 3, mr: 1 }}
                            >
                                Thử lại
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/home')}
                                sx={{ mt: 3 }}
                            >
                                Quay về trang chủ
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default BookingSuccess;