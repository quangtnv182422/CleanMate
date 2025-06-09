import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WestIcon from '@mui/icons-material/West';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { Circles } from 'react-loader-spinner';
const paymentMethods = [
    {
        id: 'CleanMate',
        label: 'Tài khoản CleanMate',
        subLabel: 'Từ số dư tài khoản CleanMate',
        balance: '0 ₫',
        icon: <AccountBalanceWalletIcon sx={{ color: '#43A047' }} />,
    },
    {
        id: 'vnpay',
        label: 'VNPAY',
        subLabel: '',
        icon: <CreditCardIcon sx={{ color: '#1565C0' }} />,
        available: false,
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
        subLabel: 'Thanh toán bằng tiền mặt',
        icon: <AttachMoneyIcon sx={{ color: '#1565C0' }} />
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
    const [openDialog, setOpenDialog] = useState(false);
    const [coin, setCoin] = useState(null);
    const { selectedAddress,
        price,
        selectedDay,
        formatSpecificTime,
        note,
        priceId
    } = location.state || {};
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('CleanMate');
    const { user } = useAuth();

    useEffect(() => {
        const fetchCoin = async () => {
            try {
                const response = await fetch('/wallet/get-wallet', {
                    method: 'GET',
                    credentials: 'include',
                });

                const walletData = await response.json();
                setCoin(walletData);
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        }

        fetchCoin();
    }, [])

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    function convertToISODate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const handlePayment = async () => {
        setOpenDialog(true);
    };

    const processPayment = async () => {
        const isoDate = convertToISODate(selectedDay);
        const bookingData = {
            ServicePriceId: priceId,
            UserId: user?.id,
            Note: note,
            AddressId: selectedAddress.addressId,
            Date: isoDate,
            StartTime: formatSpecificTime,
            TotalPrice: price
        };

        setIsLoading(true);

        try {
            let endpoint;
            if (selectedMethod === 'vnpay') {
                endpoint = '/payments/booking-create-vnpay';
            } else if (selectedMethod === 'bank') {
                endpoint = '/payments/booking-create-payos';
            } else if (selectedMethod === 'CleanMate') {
                endpoint = '/payments/booking-create-cmcoin';
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || 'Thanh toán thất bại');
                return;
            }

            if (selectedMethod === 'CleanMate') {
                // Không cần URL, redirect trực tiếp tới booking-success
                const result = await response.json();
                if (result.success) {
                    const queryString = `success=true&date=${encodeURIComponent(result.date)}` +
                        `&time=${encodeURIComponent(result.time)}` +
                        `&service=${encodeURIComponent(result.service)}` +
                        `&cleaner=${encodeURIComponent(result.cleaner)}` +
                        `&payment=${encodeURIComponent(result.payment)}`;
                    navigate(`/booking-success?${queryString}`);
                } else {
                    toast.error('Thanh toán bằng CleanMate thất bại');
                }
            } else {
                // VNPay hoặc PayOS: redirect tới URL thanh toán
                const result = await response.json();
                if (result.url) {
                    window.location.href = result.url;
                } else {
                    toast.error('Không nhận được URL thanh toán');
                }
            }
        } catch (error) {
            toast.error('Lỗi khi gửi yêu cầu thanh toán');
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading ? (
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        gap: '15px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Circles
                        height="80"
                        width="80"
                        color="#1976D2"
                        ariaLabel="circles-loading"
                        visible={true}
                    />
                    <Typography variant="h5">Vui lòng chờ một chút. Hệ thống đang xử lý yêu cầu của bạn</Typography>
                </Box>
            ) : (
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
                        {paymentMethods.map((method) => {
                            const isSelected = selectedMethod === method.id;
                            const isDisabled = method.available === false;

                            return (
                                <Paper
                                    key={method.id}
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        mb: 2,
                                        borderColor: isSelected ? '#1565C0' : '#e0e0e0',
                                        borderWidth: isSelected ? 2 : 1,
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        opacity: isDisabled ? 0.5 : 1,
                                        pointerEvents: isDisabled ? 'none' : 'auto',
                                        '&:hover': {
                                            borderColor: isDisabled ? '#e0e0e0' : '#1565C0',
                                        },
                                    }}
                                    onClick={() => !isDisabled && setSelectedMethod(method.id)}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ mr: 2 }}>{method.icon}</Box>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: isSelected ? '#1565C0' : 'inherit',
                                                }}
                                            >
                                                {method.label}
                                            </Typography>
                                            {method.subLabel && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {method.subLabel}
                                                </Typography>
                                            )}
                                            {method.id === 'CleanMate' && (
                                                <Typography sx={{ mt: 1, fontSize: 13 }}>
                                                    Số dư hiện tại: <strong>{formatPrice(coin?.balance)}</strong>
                                                </Typography>
                                            )}
                                            {isDisabled && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: '#d32f2f', fontWeight: 500 }}
                                                >
                                                    Chức năng này chưa sẵn sàng để sử dụng
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {method.id === 'CleanMate' && !isDisabled && (
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            sx={{
                                                fontSize: '16px',
                                                backgroundColor: '#43A047',
                                                '&:hover': { backgroundColor: '#388E3C' },
                                                textTransform: 'none',
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/coin/deposit');
                                            }}
                                        >
                                            Nạp tiền
                                        </Button>
                                    )}
                                </Paper>
                            );
                        })}
                    </Box>

                    {/* Sticky footer */}
                    <Box sx={style.footer}>
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
                            onClick={handlePayment}
                        >
                            Thanh toán
                        </Button>
                    </Box>
                    {openDialog && (
                        <Dialog
                            open={openDialog}
                            onClose={() => setOpenDialog(false)}
                        >
                            <DialogTitle>Xác nhận thanh toán</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Bạn có chắc chắn muốn thanh toán qua <strong>{selectedMethod === "CleanMate" ? "Ví CleanMate" : "Chuyển khoản ngân hàng"}</strong> với số tiền <strong>{price.toLocaleString()} VND</strong>?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenDialog(false)} color="inherit">
                                    Hủy
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOpenDialog(false);
                                        processPayment();
                                    }}
                                    color="primary"
                                    variant="contained"
                                >
                                    Xác nhận
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Box >
            )}
        </>
    );
};

export default Payment;
