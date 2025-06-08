import {styles} from './style'
import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const WorkDetails = ({ selectedWork }) => {
    const formatPrice = (price) => {
        return price?.toLocaleString("vi-VN", {
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
        <Box sx={styles.modal}>

            {/*Work information*/}
            <Box sx={styles.informationTitle}>
                <AssignmentIcon size="small" sx={styles.subtitleIcon} />
                <Typography variant="h6" sx={styles.subtitle}>Thông tin ca làm</Typography>
            </Box>
            <Box sx={styles.informationContent}>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ngày làm việc</Typography>
                    <Typography sx={styles.content}>Bắt đầu lúc {formatTime(selectedWork.startTime)} giờ ngày {formatDate(selectedWork.date)}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Địa chỉ</Typography>
                    <Typography sx={styles.content}>{selectedWork.address}</Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Thời gian làm</Typography>
                    <Typography sx={styles.content}>Làm trong {selectedWork.duration} giờ</Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ghi chú</Typography>
                    <Typography sx={styles.content}>{selectedWork.note ? selectedWork.note : "Không có ghi chú"}</Typography>
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
                    <Typography sx={styles.content}>{selectedWork.duration}h/buổi</Typography>
                </Box>

                {/*<Box sx={styles.bookingContent}>*/}
                {/*    <Typography sx={styles.bookingTitle}>Hình thức thanh toán</Typography>*/}
                {/*    <Typography sx={styles.content}>{selectedWork.payment}</Typography>*/}
                {/*</Box>*/}

                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Tiền ca làm</Typography>
                    <Typography sx={styles.content}>{formatPrice(selectedWork.totalPrice)}</Typography>
                </Box>

                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Tổng tiền</Typography>
                    <Typography sx={styles.content}>{formatPrice(selectedWork.totalPrice)}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default WorkDetails;