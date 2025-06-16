import { useContext, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
} from '@mui/material';
import { styles } from './style';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ReactLoading from 'react-loading';
import Feedback from '../../Feedback/Feedback';
import { WorkContext } from '../../../context/WorkProvider';

const OrderDetails = ({ selectedOrder, onOrderListRefresh, handleClose }) => {
    const { openFeedback, setOpenFeedback } = useContext(WorkContext);
    const [loading, setLoading] = useState(false);

    const handleOpenFeedback = () => {
        setOpenFeedback(true);
    }

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
                        <CheckCircleIcon sx={styles.iconLarge} color="success" />
                        <Typography sx={styles.status}>
                            Hoàn thành
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
                    {selectedOrder.bookingStatusId === 6 && (
                        <Box sx={styles.paymentButton}>
                            <Button variant="contained" color="primary" onClick={handleOpenFeedback}>Đánh giá dịch vụ</Button>
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
                                handleClose={handleClose}
                            />
                    </Modal>
                </Box >
            )}
        </>
    )
}

export default OrderDetails;