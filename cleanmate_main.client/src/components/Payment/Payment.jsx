import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    IconButton,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import WestIcon from '@mui/icons-material/West';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const paymentMethods = [
    {
        id: 'CleanMate',
        label: 'Tài khoản CleanMate',
        subLabel: 'Từ số dư tài khoản CleanMate',
        balance: '0 ₫',
        icon: <AccountBalanceWalletIcon sx={{ color: '#43A047' }} />,
    },
    {
        id: 'momo',
        label: 'Ví MoMo',
        subLabel: '',
        icon: <PaymentIcon sx={{ color: '#D81B60' }} />,
    },
    {
        id: 'vnpay',
        label: 'VNPAY',
        subLabel: '',
        icon: <CreditCardIcon sx={{ color: '#1565C0' }} />,
    },
    {
        id: 'bank',
        label: 'Chuyển khoản',
        subLabel: 'Qua ngân hàng',
        icon: <AccountBalanceIcon sx={{ color: '#1565C0' }} />,
    },
    {
        id: 'cash',
        label: 'Tiền mặt',
        subLabel: '',
        icon: <PaymentIcon sx={{ color: '#FF9800' }} />,
    }
];

const primaryColor = '#1565C0';

const style = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        width: '100%',
        p: 2,
        borderBottom: '1px solid #ccc',
        bgcolor: 'white'
    },
    backIcon: {
        cursor: 'pointer',
        color: primaryColor,
    },
    headerTitle: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '20px',
        color: primaryColor,
        fontWeight: 'bold',
    },
    footer: {
        position: 'sticky',
        bottom: 0,
        bgcolor: 'white',
        borderTop: '1px solid #ccc',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    }
}

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { price } = location.state || {};
    const [selectedMethod, setSelectedMethod] = useState('CleanMate');

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <Box sx={style.header}>
                <WestIcon sx={style.backIcon} onClick={() => navigate(-1)} />
                <Typography variant="h6" sx={style.headerTitle}>
                    Thanh toán
                </Typography>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {paymentMethods.map((method) => (
                    <Paper
                        key={method.id}
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            mb: 2,
                            borderColor: selectedMethod === method.id ? '#1565C0' : '#e0e0e0',
                            borderWidth: selectedMethod === method.id ? 2 : 1,
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: '#1565C0',
                            },
                        }}
                        onClick={() => setSelectedMethod(method.id)}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 2 }}>{method.icon}</Box>
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: selectedMethod === method.id ? '#1565C0' : 'inherit' }}>
                                    {method.label}
                                </Typography>
                                {method.subLabel && (
                                    <Typography variant="body2" color="text.secondary">
                                        {method.subLabel}
                                    </Typography>
                                )}
                                {method.id === 'CleanMate' && (
                                    <Typography sx={{ mt: 1, fontSize: 13 }}>
                                        Số dư hiện tại: <strong>{method.balance}</strong>
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {method.id === 'CleanMate' && (
                            <Button
                                size="medium"
                                variant="contained"
                                sx={{
                                    fontSize: '16px',
                                    backgroundColor: '#43A047',
                                    '&:hover': { backgroundColor: '#388E3C' },
                                    textTransform: 'none',
                                }}
                            >
                                Nạp tiền
                            </Button>
                        )}
                    </Paper>
                ))}
            </Box>

            {/* Sticky footer */}
            <Box
                sx={style.footer}
            >
                <Box>
                    <Typography variant="body2">Số tiền phải thanh toán</Typography>
                    <Typography variant="h6" sx={{ color: '#1565C0', fontWeight: 600 }}>
                        {formatPrice(price)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        fontSize: '16px',
                        bgcolor: '#1565C0',
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#0d47a1' },
                    }}
                    onClick={() => alert(`Thanh toán qua: ${selectedMethod}`)}
                >
                    Thanh toán
                </Button>
            </Box>
        </Box>
    );
};

export default Payment;
