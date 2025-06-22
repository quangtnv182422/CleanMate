import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import { deepPurple, teal, yellow } from '@mui/material/colors';
import { styles } from './style';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { toast } from 'react-toastify';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import StarRateIcon from '@mui/icons-material/StarRate';
import ReactLoading from 'react-loading';
import Feedback from '../../components/Feedback/Feedback';
import { BookingContext } from '../../context/BookingProvider';

const OrderDetails = ({ fetchBookings, selectedOrder, onOrderListRefresh, handleClose }) => {
    const { fetchNoRatingBooking } = useContext(BookingContext);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [connection, setConnection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cleaner, setCleaner] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('/workHub') // Ensure this matches your server's SignalR hub endpoint
            .withAutomaticReconnect()
            .configureLogging('debug') // Enable debug logging for SignalR
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .catch(err => console.error('SignalR Connection Error: ', err));

            connection.on('ReceiveWorkUpdate', () => {
                //fetchWorkDetails(); // Refetch data for this component
                if (onOrderListRefresh) onOrderListRefresh(); // Notify parent to refresh list
            });

            // Cleanup on unmount
            return () => {
                connection.off('ReceiveWorkUpdate');
                connection.stop();
            };
        }
    }, [connection, onOrderListRefresh]);

    const handleConfirmCompleteWork = async () => {
        try {
            const res = await fetch(`/bookings/${selectedOrder.bookingId}/confirm-complete-work`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();
            if (res.ok && result.success) {
                toast.success('Bạn đã xác nhận công việc thành công.');
                fetchBookings(); // Manual refresh as a fallback
                //if (onOrderListRefresh) onOrderListRefresh(); // Trigger list refresh manually

            } else {
                toast.error(result.message || 'Không thể xác nhận công việc.');
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận công việc:', error);
            toast.error('Có lỗi xảy ra khi gọi API.');
        }
    }

    const fetchCleanerDetails = useCallback(async () => {
        if (!selectedOrder?.cleanerId) return;
        try {
            setLoading(true);
            const response = await fetch(`/customerprofile/${selectedOrder.cleanerId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cleaner details');
            }

            const data = await response.json();
            setCleaner(data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [selectedOrder.cleanerId])

    useEffect(() => {
        fetchCleanerDetails();
    }, [fetchCleanerDetails])

    const handleOpenFeedback = () => {
        setOpenFeedback(true);
    }

    const handleCloseFeedback = () => {
        setOpenFeedback(false);
        fetchNoRatingBooking();
        handleClose();
    };

    const formatPrice = (price) => {
        return price.toLocaleString("vi-VN", {
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
            {loading ? (
                <Box sx={styles.spinnerContainer}>
                    <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
                </Box>
            ) : (
                <Box sx={styles.modal}>
                    <Typography variant="h4" sx={styles.orderDetailTitle}>{selectedOrder.serviceName}</Typography>

                    {/*Status*/}
                    <Box sx={styles.statusContainer}>
                        {
                            selectedOrder.status === "active"
                                ? (<NoteAddIcon sx={styles.iconLarge} color="primary" />)
                                : selectedOrder.status === "completed" || selectedOrder.status === "accepted"
                                    ? (<CheckCircleIcon sx={styles.iconLarge} color="success" />)
                                    : selectedOrder.status === "inProgress" || selectedOrder.status === "pending"
                                        ? (<PendingIcon sx={styles.iconLarge} color="warning" />)
                                        : (<CancelIcon sx={styles.iconLarge} color="error" />)
                        }
                        <Typography sx={styles.status}>
                            {selectedOrder.status === "active"
                                ? "Việc mới"
                                : selectedOrder.status === "paymentFail"
                                    ? "Thanh toán thất bại"
                                    : selectedOrder.status === "completed"
                                        ? "Hoàn thành"
                                        : selectedOrder.status === "accepted"
                                            ? "Đã nhận"
                                            : selectedOrder.status === "inProgress"
                                                ? "Đang tiến hành"
                                                : selectedOrder.status === "pending"
                                                    ? "Chờ xác nhận"
                                                    : "Đã hủy"}
                        </Typography>
                    </Box>

                    {/*Order information*/}
                    <Box sx={styles.informationTitle}>
                        <AssignmentIcon size="small" sx={styles.subtitleIcon} />
                        <Typography variant="h6" sx={styles.subtitle}>Thông tin ca làm</Typography>
                    </Box>
                    <Box sx={styles.informationContent}>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Ngày làm việc</Typography>
                            <Typography sx={styles.content}>Bắt đầu lúc {formatTime(selectedOrder.startTime)} giờ ngày {formatDate(selectedOrder.date)}</Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Địa chỉ</Typography>
                            <Typography sx={styles.content}>{`${selectedOrder.addressNo}, ${selectedOrder.addressFormatted}`}</Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Số lượng Nhân viên</Typography>
                            <Typography sx={styles.content}>1 nhân viên làm trong {selectedOrder.durationTime} giờ</Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Nhân viên</Typography>
                            {cleaner ? (
                                    <Card sx={{
                                        maxWidth: '100%',
                                        margin: 'auto',
                                        border: '1px solid #1976D2',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        mt: 2,
                                        padding: 1,

                                        '&:hover': {
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        }
                                    }}
                                        onClick={() => navigate(`/team-single?cleanerId=${cleaner.userId}`) }
                                >
                                    <CardContent sx={{ textAlign: 'center', display: 'flex', gap: 2, padding: '8px !important' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: deepPurple[500],
                                                    width: 60,
                                                    height: 60,
                                                    margin: '0 auto 8px',
                                                    border: '3px solid #fff',
                                                }}
                                                alt={cleaner.fullName}
                                                src={cleaner.avatarUrl || undefined}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
                                                <StarRateIcon sx={{ color: yellow[800] }} />
                                                {cleaner.averageRating}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: 'start' }}>
                                            <Typography variant="h6" color={teal[700]} gutterBottom sx={{ fontWeight: 'bold' }}>
                                                {cleaner.fullName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Số điện thoại: <span style={{ fontWeight: 'bold' }}>{cleaner.phoneNumber}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Khu vực hoạt động: <span style={{ fontWeight: 'bold' }}> {cleaner.activeAreas}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Số năm kinh nghiệm: <span style={{ fontWeight: 'bold' }}>{cleaner.experienceYears} năm</span>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Typography sx={styles.content}>{selectedOrder?.cleanerName}</Typography>
                            )}
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Ghi chú</Typography>
                            <Typography sx={styles.content}>{selectedOrder.note ? selectedOrder.note : "Không có ghi chú"}</Typography>
                        </Box>
                    </Box>

                    {/*Booking*/}
                    <Box sx={styles.informationTitle}>
                        <LibraryBooksIcon size="small" sx={styles.subtitleIcon} />
                        <Typography variant="h6" sx={styles.subtitle}>Đơn hàng</Typography>
                    </Box>

                    <Box sx={styles.informationContent}>
                        <Box sx={styles.bookingContent}>
                            <Typography sx={styles.bookingTitle}>Số giờ/buổi</Typography>
                            <Typography sx={styles.content}>{selectedOrder.durationTime}h/buổi</Typography>
                        </Box>

                        <Box sx={styles.bookingContent}>
                            <Typography sx={styles.bookingTitle}>Hình thức thanh toán</Typography>
                            <Typography sx={styles.content}>{selectedOrder.paymentMethod}</Typography>
                        </Box>
                        <Box sx={styles.bookingContent}>
                            <Typography sx={styles.bookingTitle}>Trạng thái thanh toán</Typography>
                            <Typography sx={styles.content}>{selectedOrder.paymentStatus}</Typography>
                        </Box>

                        <Box sx={styles.bookingContent}>
                            <Typography sx={styles.bookingTitle}>Tiền ca làm</Typography>
                            <Typography sx={styles.content}>{formatPrice(selectedOrder.price)}</Typography>
                        </Box>

                        <Box sx={styles.bookingContent}>
                            <Typography sx={styles.bookingTitle}>Tổng tiền</Typography>
                            <Typography sx={styles.content}>{formatPrice(selectedOrder.totalPrice)}</Typography>
                        </Box>
                    </Box>

                    {selectedOrder.status === 'pending' && (
                        <Box sx={styles.paymentButton}>
                            <Button variant="contained" color="primary" onClick={() => setOpenConfirm(true)}>Xác nhận hoàn thành</Button>
                        </Box>
                    )}

                    {/*Modal feedback*/}
                    <Modal
                        open={openFeedback}
                        onClose={handleCloseFeedback}
                        disableAutoFocus
                    >
                        <Feedback
                            selectedOrder={selectedOrder}
                            loading={loading}
                            setLoading={setLoading}
                            onOrderListRefresh={onOrderListRefresh}
                            handleClose={handleCloseFeedback}
                        />
                    </Modal>

                    {selectedOrder.status === 'paymentFail' && (
                        <Box sx={styles.paymentButton}>
                            <Button variant="contained" color="primary">Thanh toán lại</Button>
                        </Box>
                    )}
                    {/* Confirmation Dialog */}
                    <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                        <DialogTitle>Xác nhận hoàn thành</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Bạn có chắc chắn xác nhận công việc này đã hoàn thành?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenConfirm(false)} color="error">
                                Hủy
                            </Button>
                            <Button
                                onClick={() => {
                                    handleConfirmCompleteWork();
                                    handleOpenFeedback();
                                }}
                                color="primary"
                                variant="contained"
                            >
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box >
            )}
        </>
    )
}

export default OrderDetails;