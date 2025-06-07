import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Pagination,
    Button,
    Modal,
} from '@mui/material';
import { style } from './style';
import OrderDetails from '../../main-component/OrderDetails/OrderDetails';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const mockOrders = Array(30).fill(null).map((_, index) => ({
    id: `#362689FG-${index + 1}`,
    service: 'Dọn dẹp theo giờ',
    startTime: '10',
    date: '20/5/2025',
    price: 200000,
    duration: 2,
    note: 'Nhà có mèo, dọn kỹ gầm bàn, gầm giường, và các góc khuất khác. Không cần dọn bếp vì đã có người dọn.',
    name: 'Hoàng Tiến Dũng',
    address: 'Số nhà 30, Nguyễn Sơn, Bồ Đề, Long Biên, Hà Nội',
    payment: 'Tiền mặt',
    employee: 1,
    status:
        index % 4 === 0 ? 'canceled' :
            index % 3 === 0 ? 'paymentFail' :
                index % 2 === 1 ? 'active' :
                    'completed',
}));

const ORDERS_PER_PAGE = 6;

const colorMap = {
    total: {
        background: '#e3f2fd',
        border: '#e3f2fd',
        color: '#1976D2',
    },
    pending: {
        background: '#FBC11B',
        border: '#FBC11B',
        blurBackground: '#FFF8E1',
        color: '#fff',
    },
    completed: {
        background: '#5CBB52',
        border: '#5CBB52',
        blurBackground: '#E8F5E9',
        color: '#fff',
    },
    canceled: {
        background: '#E4293D',
        border: '#E4293D',
        blurBackground: '#FFEBEE',
        color: '#fff',
    },
    paymentFail: {
        background: '#E4293D',
        border: '#E4293D',
        blurBackground: '#FFEBEE',
        color: '#fff',
    },
    accepted: {
        background: '#4FC3F7',
        border: '#4FC3F7',
        blurBackground: '#E1F5FE',
        color: '#fff',
    },
    inProgress: {
        background: '#9575CD',
        border: '#9575CD',
        blurBackground: '#EDE7F6',
        color: '#fff',
    },
    active: {
        background: '#1976D2',
        border: '#1976D2',
        blurBackground: '#E5EFFA',
        color: '#fff',
    },
};

const statusMap = {
    1: 'active',         // Việc mới
    2: 'canceled',       // Đã huỷ
    3: 'accepted',       // Đã nhận
    4: 'inProgress',     // Đang thực hiện
    5: 'pending',        // Chờ xác nhận
    6: 'completed',      // Hoàn thành
};

const statusLabelMap = {
    active: "Việc mới",
    canceled: 'Đã hủy',
    accepted: 'Đã nhận',
    inProgress: 'Đang thực hiện',
    pending: 'Chờ xác nhận',
    completed: 'Hoàn thành',
    paymentFail: 'Thanh toán thất bại',
};

const OrderHistorySection = () => {
    const [selectedTab, setSelectedTab] = useState('total');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();

    console.log(bookings)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/bookings/get-bookings', {
                    params: {
                        userId: user.id,
                    },
                });

                const rawData = response.data;

                // 3. Chuyển đổi status code thành status key
                const convertedData = rawData.map(item => ({
                    ...item,
                    status: statusMap[item.bookingStatusId] || 'unknown',
                }));

                setBookings(convertedData);
            } catch (error) {
                console.error('Lỗi khi fetch bookings:', error);
            }
        };

        fetchBookings();
    }, [user])

    const handleOpenOrderDetails = (order) => {
        setOpen(true);
        setSelectedOrder(order);
    };
    const handleClose = () => setOpen(false);

    const stats = {
        pending: bookings.filter((o) => o.status === 'pending').length,
        completed: bookings.filter((o) => o.status === 'completed').length,
        canceled: bookings.filter((o) => o.status === 'canceled').length,
        paymentFail: bookings.filter((o) => o.status === 'paymentFail').length,
    };
    stats.total = bookings.length;

    const filteredOrders = bookings.filter(order =>
        selectedTab === 'total' ? true : order.status === selectedTab
    );

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const displayedOrders = filteredOrders.slice(
        (page - 1) * ORDERS_PER_PAGE,
        page * ORDERS_PER_PAGE
    );

    const handleSelect = (type) => {
        setSelectedTab(type);
        setPage(1);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })
    }

    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        return `${hour}:${minute}`
    }

    const formatDate = (input) => {
        const date = new Date(input);
        if (isNaN(date)) return '';
        return date.toLocaleDateString('vi-VN');
    }

    return (
        <Box sx={style.orderHistorySection}>
            <Box className="container" sx={style.container}>
                {/* Tabs */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {['total', 'pending', 'completed', 'canceled', 'paymentFail'].map((type) => {
                        const selected = selectedTab === type;
                        const colors = colorMap[type];
                        return (
                            <Grid item xs={12} sm={2.4} key={type}>
                                <Card
                                    onClick={() => handleSelect(type)}
                                    sx={{
                                        ...style.tabCard,
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        filter: selected ? 'brightness(0.8)' : 'brightness(1)',
                                        color: colors.color,
                                        '&:hover': {
                                            filter: 'brightness(0.8)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{
                                        '@media (min-width: 600px)': {
                                            p: 1,
                                        }
                                    }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'inherit',
                                                mb: 1,
                                                '@media (max-width: 600px)': {
                                                    fontSize: '12px',
                                                },
                                            }}>
                                            {type === 'total'
                                                ? 'Tổng số đơn'
                                                : type === 'pending'
                                                    ? 'Chờ xác nhận'
                                                    : type === 'paymentFail'
                                                        ? 'Thanh toán thất bại'
                                                        : type === 'completed'
                                                            ? 'Đơn hoàn thành'
                                                            : 'Đơn đã hủy'}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={600} sx={{ color: 'inherit' }}>
                                            {stats[type]}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Stats Summary */}
                <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="textSecondary">
                        Tổng: {stats.total} | Chờ xác nhận: {stats.pending} | Đơn hoàn thành: {stats.completed} | Đơn đã hủy: {stats.canceled} | Thanh toán thất bại: {stats.paymentFail}
                    </Typography>
                </Box>

                {/* List of Orders */}
                <Grid container spacing={2}>
                    {displayedOrders.map((order, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card sx={style.orderCard} onClick={() => handleOpenOrderDetails(order)}>
                                <CardContent>
                                    <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>Bắt đầu lúc {formatTime(order.startTime)} giờ ngày {formatDate(order.date)}</Typography>
                                    <Typography sx={{ mt: 2, fontWeight: 500 }}>{order.userName}</Typography>
                                    <Typography variant="subtitle2" color="textSecondary">{order.addressFormatted}</Typography>
                                    <Box sx={style.priceSection}>
                                        <Typography variant="h6" sx={{ color: '#1976D2' }}>Số tiền: {formatPrice(order.totalPrice)}</Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                ...style.status,
                                                color:
                                                    order.status === 'active' ? '#1976D2' :
                                                        order.status === 'completed' ? '#5CBB52' :
                                                            order.status === 'pending' ? '#FBC11B' :
                                                                order.status === 'canceled' ? '#E4293D' :
                                                                    order.status === 'paymentFail' ? '#E4293D' :
                                                                        order.status === 'accepted' ? '#4FC3F7' :
                                                                            order.status === 'inProgress' ? '#9575CD' :
                                                                                '#E4293D',
                                                backgroundColor: colorMap[order.status]?.blurBackground || "#fff",
                                                borderColor: colorMap[order.status]?.border || "#ccc",
                                            }}
                                        >
                                            {statusLabelMap[order.status] || 'Không xác định'}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {open && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableAutoFocus
                    >
                        <OrderDetails selectedOrder={selectedOrder} />
                    </Modal>
                )}

                {/* Pagination */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default OrderHistorySection;
