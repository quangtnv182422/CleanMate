import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';

const BookingFail = () => {
    const [searchParams] = useSearchParams();
    const deposit = searchParams.get('deposit');
    // Sample error context (replace with actual data from your state or API)
    const errorContext = {
        dateAttempted: '22/5/2025, 03:26 PM',
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#f0f4f8', // Light background for contrast
            }}
        >
            <Card sx={{ width: 400, textAlign: 'center', p: 3 }}>
                <CardContent>
                    {deposit && deposit === "fail" ? (
                        <>
                            <CancelIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Nạp tiền thất bại
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Rất tiếc, nhưng có vẻ như đã xảy ra sự cố trong quá trình nạp tiền của bạn.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Ngày thực hiện: {errorContext.dateAttempted}
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="/coin/deposit"
                                    sx={{ mr: 1 }}
                                >
                                    Thử lại
                                </Button>
                                <Button
                                    variant="outlined"
                                    href="/home" // Replace with your home route
                                >
                                    Quay về trang chủ
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <CancelIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Đăng ký dịch vụ thất bại
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Rất tiếc, nhưng có vẻ như đã xảy ra sự cố trong quá trình đặt dịch vụ của bạn.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Ngày thực hiện: {errorContext.dateAttempted}
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 1 }}
                                >
                                    Thử lại
                                </Button>
                                <Button
                                    variant="outlined"
                                    href="/home" // Replace with your home route
                                >
                                    Quay về trang chủ
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box >
    );
};

export default BookingFail;