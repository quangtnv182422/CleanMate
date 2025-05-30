import { useState } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { styles } from './style';
const OrderDetails = ({ selectedOrder }) => {

    const formatPrice = (price) => {
        return price.toLocaleString("vi-VN", {
            style: 'currency',
            currency: 'VND',
        })
    }
    return (
        <Box sx={styles.modal}>
            <Typography variant="h4" sx={styles.orderDetailTitle}>{selectedOrder.service}</Typography>

            {/*Status*/}
            <Box sx={styles.statusContainer}>
                {
                    selectedOrder.status === "active"
                        ? (<PendingIcon sx={styles.iconLarge} color="warning" />)
                        : selectedOrder.status === "completed"
                            ? (<CheckCircleIcon sx={styles.iconLarge} color="success" />)
                            : (<CancelIcon sx={styles.iconLarge} color="error" />)
                }
                <Typography sx={styles.status}>
                    {selectedOrder.status === "active"
                        ? "Chờ xác nhận"
                        : selectedOrder.status === "completed"
                            ? "Hoàn thành"
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
                    <Typography sx={styles.content}>Bắt đầu lúc {selectedOrder.startTime} giờ ngày {selectedOrder.date}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Địa chỉ</Typography>
                    <Typography sx={styles.content}>{selectedOrder.address}</Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Nhân viên</Typography>
                    <Typography sx={styles.content}>{selectedOrder.employee} nhân viên làm trong {selectedOrder.duration} giờ</Typography>
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
                    <Typography sx={styles.content}>{selectedOrder.duration}h/buổi</Typography>
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
                    <Typography sx={styles.content}>{formatPrice(selectedOrder.price)}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default OrderDetails;