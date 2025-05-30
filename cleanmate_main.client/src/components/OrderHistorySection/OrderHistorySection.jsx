import { useState } from 'react';
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

const mockOrders = Array(15).fill(null).map((_, index) => ({
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
    active: {
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
};

const OrderHistorySection = () => {
    const [selectedTab, setSelectedTab] = useState('total');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpenOrderDetails = (order) => {
        setOpen(true);
        setSelectedOrder(order);
    };
    const handleClose = () => setOpen(false);

    const stats = {
        active: mockOrders.filter((o) => o.status === 'active').length,
        completed: mockOrders.filter((o) => o.status === 'completed').length,
        canceled: mockOrders.filter((o) => o.status === 'canceled').length,
    };
    stats.total = mockOrders.length;

    const filteredOrders = mockOrders.filter(order =>
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

    return (
        <Box sx={style.orderHistorySection}>
            <Box className="container" sx={style.container}>
                {/* Tabs */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {['total', 'active', 'completed', 'canceled'].map((type) => {
                        const selected = selectedTab === type;
                        const colors = colorMap[type];
                        return (
                            <Grid item xs={12} sm={3} key={type}>
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
                                                : type === 'active'
                                                    ? 'Chờ xác nhận'
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
                        Tổng: {stats.total} | Đang xử lý: {stats.active} | Đã hoàn thành: {stats.completed} | Đã hủy: {stats.canceled}
                    </Typography>
                </Box>

                {/* List of Orders */}
                <Grid container spacing={2}>
                    {displayedOrders.map((order, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card sx={style.orderCard} onClick={() => handleOpenOrderDetails(order)}>
                                <CardContent>
                                    <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>Bắt đầu lúc {order.startTime} giờ ngày {order.date}</Typography>
                                    <Typography sx={{ mt: 2, fontWeight: 500 }}>{order.name}</Typography>
                                    <Typography variant="subtitle2" color="textSecondary">{order.address}</Typography>
                                    <Box sx={style.priceSection}>
                                        <Typography variant="h6" sx={{ color: '#1976D2' }}>Số tiền: {formatPrice(order.price)}</Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                ...style.status,
                                                color: order.status === 'active' ? '#FBC11B' : order.status === 'completed' ? '#5CBB52' : '#E4293D',
                                                backgroundColor: colorMap[order.status].blurBackground,
                                                borderColor: colorMap[order.status].border,
                                            }}
                                        >
                                            {order.status === "active"
                                                ? "Chờ xác nhận"
                                                : order.status === "completed"
                                                    ? "Hoàn thành"
                                                    : "Đã hủy"}
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
