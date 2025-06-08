import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const BookingDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const {
        date = 'N/A',
        time = 'N/A',
        service = 'N/A',
        cleaner = 'N/A',
        payment = 'N/A',
    } = location.state || {};

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            px={2}
        >
            <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Chi tiết đặt lịch
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body1" gutterBottom>
                        <strong>Khách hàng:</strong> {user?.fullName || 'Ẩn danh'}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Ngày:</strong> {date}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Giờ bắt đầu:</strong> {time}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Dịch vụ:</strong> {service}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Nhân viên vệ sinh:</strong> {cleaner}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <strong>Số tiền:</strong> {payment}
                    </Typography>

                    <Box mt={4} display="flex" justifyContent="center" gap={1}>
                        <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>Quay lại</Button>
                        <Button variant="contained" color="primary" onClick={() => navigate('/home')}>
                            Quay về trang chủ
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BookingDetails;
