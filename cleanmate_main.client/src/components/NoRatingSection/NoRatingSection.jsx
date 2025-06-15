import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Pagination,
    Button,
    Modal,
    TextField,
} from '@mui/material';
import { style } from './style.js';
import useAuth from '../../hooks/useAuth.jsx';
import { BookingContext } from '../../context/BookingProvider.jsx';
import Details from './Details/Details.jsx'

const WORKS_PER_PAGE = 6;


const NoRatingSection = () => {
    const { noRatingOrder } = useContext(BookingContext);

    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { user } = useAuth();
    const role = user?.roles?.[0] || '';

    const handleClose = () => {
        setOpen(false);
        setSelectedOrder(null);
    };

    const handleOpen = (order) => {
        setOpen(true);
        setSelectedOrder(order)
    }

    const filteredOrder = noRatingOrder.filter((order) =>
        order.serviceName.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOrder.length / WORKS_PER_PAGE);
    const displayedOrder = filteredOrder.slice(
        (page - 1) * WORKS_PER_PAGE,
        page * WORKS_PER_PAGE
    );

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        return `${hour}:${minute}`;
    };

    const formatDate = (input) => {
        const date = new Date(input);
        if (isNaN(date)) return '';
        return date.toLocaleDateString('vi-VN');
    };
    return (
        <Box sx={style.noRatingSection}>
            <Box className="container" sx={style.container}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Tìm công việc theo tên"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 200 }}
                    />
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedOrder.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có đơn hàng nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedOrder.map((order, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpen(order)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Bắt đầu lúc {formatTime(order.startTime)} giờ ngày {formatDate(order.date)}
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>{order.userName}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary">{order.addressFormatted}</Typography>
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(order.totalPrice)}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    ...style.status,
                                                    color: '#28A745',
                                                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                                    borderColor: '#28A745',
                                                }}
                                            >
                                                {order.status}
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
                        <Details selectedOrder={selectedOrder} handleClose={handleClose} />
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
    )
}

export default NoRatingSection