import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
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
import ReactLoading from 'react-loading';
import axios from 'axios';

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
    const [connection, setConnection] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false)
        }
    }, [user?.id])


    useEffect(() => {
        fetchBookings();
    }, [fetchBookings])

    // Khởi tạo connection trong useEffect
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("/workHub")
            .build();
        setConnection(newConnection);
    }, []);

    // Kết nối và lắng nghe sự kiện
    useEffect(() => {
        if (connection) {
            if (connection.state === signalR.HubConnectionState.Disconnected) {
                connection.start()
                    .catch(err => console.error('SignalR Connection Error: ', err));
            }

            connection.on('ReceiveBookingUpdate', () => {
                fetchBookings();
            });

            return () => {
                connection.off('ReceiveBookingUpdate');
                if (connection.state !== signalR.HubConnectionState.Disconnected) {
                    connection.stop();
                }
            };
        }
    }, [connection, fetchBookings]);

    const handleOpenOrderDetails = (order) => {
        setOpen(true);
        setSelectedOrder(order);
    };
    const handleClose = () => {
        setOpen(false);
    }

    const stats = {
        active: bookings.filter((o) => o.status === "active").length,
        canceled: bookings.filter((o) => o.status === 'canceled').length,
        accepted: bookings.filter((o) => o.status === 'accepted').length,
        inProgress: bookings.filter((o) => o.status === "inProgress").length,
        pending: bookings.filter((o) => o.status === 'pending').length,
        completed: bookings.filter((o) => o.status === 'completed').length,
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
        <>
            {loading && (
                <Box sx={style.spinnerContainer}>
                    <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
                </Box>
            )}
            <Box sx={style.orderHistorySection}>
                <Box className="container" sx={style.container}>
                    {/* Tabs */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {['total', 'active', 'accepted', 'inProgress', 'pending', 'completed', 'canceled', 'paymentFail'].map((type) => {
                            const selected = selectedTab === type;
                            const colors = colorMap[type];
                            return (
                                <Grid item xs={6} sm={2.4} key={type}>
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
                                                    : type === "active"
                                                        ? 'Việc mới'
                                                        : type === "inProgress"
                                                            ? "Đang thực hiện"
                                                            : type === "accepted"
                                                                ? "Đơn đã nhận"
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
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'inherit',
                                                    mt: 1,
                                                    '@media (max-width: 600px)': {
                                                        fontSize: '12px',
                                                    },
                                                }}>
                                                {type === 'total'
                                                    ? 'Tổng số đơn'
                                                    : type === "active"
                                                        ? 'Công việc mới được đăng bởi khách hàng'
                                                        : type === "inProgress"
                                                            ? "Người dọn dẹp đang trong quá trình thực hiện công việc"
                                                            : type === "accepted"
                                                                ? "Công việc đã được nhận bởi người dọn dẹp"
                                                                : type === 'pending'
                                                                    ? 'Công việc đã hoàn thành, chờ khách hàng xác nhận'
                                                                    : type === 'paymentFail'
                                                                        ? 'Đơn hàng thanh toán thất bại'
                                                                        : type === 'completed'
                                                                            ? 'Công việc đã hoàn thành và được xác nhận'
                                                                            : 'Công việc này đã bị hủy'}
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
                        {displayedOrders.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
                                    Không có đơn hàng nào.
                                </Typography>
                            </Grid>
                        ) : (
                            displayedOrders.map((order, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Card sx={style.orderCard} onClick={() => handleOpenOrderDetails(order)}>
                                        <CardContent>
                                            <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                                Bắt đầu lúc {formatTime(order.startTime)} giờ ngày {formatDate(order.date)}
                                            </Typography>
                                            <Typography sx={{ mt: 2, fontWeight: 500 }}>{order.userName}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">{order.addressNo}, {order.addressFormatted}</Typography>
                                            <Box sx={style.priceSection}>
                                                <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                    Số tiền: {formatPrice(order.totalPrice)}
                                                </Typography>
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
                            ))
                        )}
                    </Grid>

                    {open && (
                        <Modal
                            open={open}
                            onClose={handleClose}
                            disableAutoFocus
                        >
                            <OrderDetails fetchBookings={fetchBookings} selectedOrder={selectedOrder} handleClose={handleClose} />
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
        </>
    );
};

export default OrderHistorySection;
