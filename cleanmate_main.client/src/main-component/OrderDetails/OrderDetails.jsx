import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    Rating,
    Chip,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { styles } from './style';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { toast } from 'react-toastify';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import serviceImage from '../../images/service-single/hourly-cleaning-main-image.jpg';
import ReactLoading from 'react-loading';
import axios from 'axios';

const OrderDetails = ({ selectedOrder, onOrderListRefresh, handleClose }) => {
    const [openFeedback, setOpenFeedback] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [connection, setConnection] = useState(null);
    const [loading, setLoading] = useState(false);

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
                //fetchWorkDetails(); // Manual refresh as a fallback
                if (onOrderListRefresh) onOrderListRefresh(); // Trigger list refresh manually

            } else {
                toast.error(result.message || 'Không thể xác nhận công việc.');
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận công việc:', error);
            toast.error('Có lỗi xảy ra khi gọi API.');
        }
    }

    const handleOpenFeedback = () => {
        setOpenFeedback(true);
    }

    const [ratingValue, setRatingValue] = useState(null);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [otherReason, setOtherReason] = useState("");

    const handleReasonSelect = (reason) => {
        setSelectedReasons(prev =>
            prev.includes(reason)
                ? prev.filter(item => item !== reason)
                : [...prev, reason]
        );
    };

    const feedbackLabels = {
        1: "Rất không hài lòng",
        2: "Không hài lòng",
        3: "Bình thường",
        4: "Hài lòng",
        5: "Rất hài lòng"
    }

    const feedbackReason = [
        {
            star: 1,
            reason: [
                "Không tới làm",
                "Thái độ không tốt",
                "Làm không đúng yêu cầu",
                "Không sạch sẽ",
                "Không đúng giờ",
                "Không mặc đồng phục",
            ],
            inputText: true,
        },
        {
            star: 2,
            reason: [
                "Không đúng giờ",
                "Thái độ chưa tốt",
                "Làm chưa kỹ",
                "Không sạch sẽ",
                "Không mặc đồng phục",
            ],
            inputText: true,
        },
        {
            star: 3,
            reason: [
                "Không đúng giờ",
                "Làm chưa kỹ",
                "Chưa thân thiện",
                "Không mặc đồng phục",
            ],
            inputText: true,
        },
        {
            star: 4,
            reason: [
                "Cần cải thiện thái độ",
                "Cần sạch sẽ hơn",
                "Cần đúng giờ hơn",
            ],
            inputText: true,
        },
        {
            star: 5,
            reason: [
                "Rất hài lòng",
                "Làm việc vượt mong đợi",
                "Thái độ chuyên nghiệp",
                "Rất sạch sẽ",
                "Sẽ giới thiệu cho người khác",
            ],
            inputText: false,
        },
    ];

    const postFeedback = async (bookingId, cleanerId, rating, content, selectedReasons, otherReason) => {
        try {
            const feedbackData = {
                bookingId: bookingId,
                cleanerId: cleanerId,
                rating: rating,
                content: content || '',
            };

            let feedbackContent = '';
            if (selectedReasons.length > 0) {
                feedbackContent += selectedReasons.join(', ') + '. ';
            }
            if (otherReason) {
                feedbackContent += otherReason;
            }
            feedbackData.content = feedbackContent || 'Không có ghi chú thêm.';

            const response = await axios.post('/feedback', feedbackData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Đảm bảo gửi cookie nếu cần
            });

            if (response.status === 200) {
                toast.success('Gửi đánh giá thành công.');
                return true;
            } else {
                toast.error(response.data.message || 'Gửi đánh giá thất bại.');
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi gửi phản hồi:', error);
            toast.error('Có lỗi xảy ra khi gửi phản hồi.');
            return false;
        }
    };

    const handleSubmitFeedback = async () => {
        if (loading) return;
        setLoading(true);

        const success = await postFeedback(
            selectedOrder.bookingId,
            selectedOrder.cleanerId,
            ratingValue,
            '',
            selectedReasons,
            otherReason
        );

        if (success) {
            handleClose();
            if (onOrderListRefresh) onOrderListRefresh();
        }

        setLoading(false)
    };

    const handleCloseFeedback = () => setOpenFeedback(false);

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
                            <Typography sx={styles.content}>{selectedOrder.addressFormatted}</Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Số lượng Nhân viên</Typography>
                            <Typography sx={styles.content}>1 nhân viên làm trong {selectedOrder.durationTime} giờ</Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography sx={styles.contentTitle}>Nhân viên</Typography>
                            <Typography sx={styles.content}>{selectedOrder?.cleanerName}</Typography>
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
                            <Typography sx={styles.content}>{selectedOrder.payment}</Typography>
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
                        <Box sx={styles.modalFeedback}>
                            <Box sx={styles.serviceImage}>
                                <img
                                    src={serviceImage}
                                    alt="hình ảnh của dịch vụ"
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                    }} />
                            </Box>

                            <Typography variant="h5" sx={styles.feedbackTitle}>Đánh giá dịch vụ</Typography>

                            <Divider />

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                {ratingValue !== null && (
                                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 500, color: '#666' }}>
                                        {feedbackLabels[ratingValue]}
                                    </Typography>
                                )}
                                <Rating
                                    value={ratingValue}
                                    onChange={(event, newValue) => {
                                        setRatingValue(newValue);
                                    }}
                                    size="large"
                                    sx={{
                                        color: '#FBC11B',
                                        '& .MuiRating-iconFilled': {
                                            color: '#FBC11B',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: '#FBC11B',
                                        },
                                    }}
                                />
                            </Box>

                            {ratingValue <= 5 && ratingValue > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography sx={{ mb: 1, textAlign: 'center' }}>Điều gì bạn chưa hài lòng?</Typography>
                                    <Box sx={styles.feedbackReason}>
                                        {feedbackReason
                                            .find(item => item.star === ratingValue)?.reason
                                            .map((reason, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={reason}
                                                    variant={selectedReasons.includes(reason) ? 'filled' : 'outlined'}
                                                    color={selectedReasons.includes(reason) ? 'warning' : 'default'}
                                                    onClick={() => handleReasonSelect(reason)}
                                                />
                                            ))
                                        }
                                    </Box>
                                    {(() => {
                                        const selectedFeedback = feedbackReason.find(item => item.star === ratingValue);
                                        if (selectedFeedback?.inputText) {
                                            return (
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    minRows={3}
                                                    sx={{ mt: 2 }}
                                                    placeholder="Vui lòng nhập lý do khác..."
                                                    value={otherReason}
                                                    onChange={(e) => setOtherReason(e.target.value)}
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                </Box>
                            )}

                            <Box sx={{ display: 'flex' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ mt: 1, ml: 'auto' }}
                                    onClick={handleSubmitFeedback}
                                >
                                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                                </Button>
                            </Box>
                        </Box>
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