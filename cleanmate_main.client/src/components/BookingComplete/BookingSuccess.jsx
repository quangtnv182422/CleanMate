import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import classNames from 'classnames/bind';
import styles from './style.module.scss';

const cx = classNames.bind(styles);

const BookingSuccess = () => {
    // Sample booking data (replace with actual data from your state or API)
    const bookingDetails = {
        date: '22/05/2025',
        time: '03:10 PM - 05:10 PM',
        service: 'Hourly Cleaning',
        cleaner: 'Nguyễn Văn A',
        payment: '500,000 VND',
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
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Bạn đã đặt dịch vụ thành công!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Dịch vụ của bạn đặt đã được xác nhận. Cảm ơn vì đã chọn chúng tôi!
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: 'left' }}>
                        <Typography variant="body2">Ngày: {bookingDetails.date}</Typography>
                        <Typography variant="body2">Thời gian: {bookingDetails.time}</Typography>
                        <Typography variant="body2">Dịch vụ: {bookingDetails.service}</Typography>
                        <Typography variant="body2">Người chịu trách nhiệm dọn dẹp: {bookingDetails.cleaner}</Typography>
                        <Typography variant="body2">Tổng tiền phải thanh toán: {bookingDetails.payment}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        className={cx('view-booking-details-button')}
                        sx={{ mt: 3, mr: 1 }}
                    >
                        Xem chi tiết đơn hàng
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ mt: 3 }}
                        href="/home"
                    >
                        Quay về trang chủ
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};



export default BookingSuccess;