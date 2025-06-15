import { styles } from './style';
import { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const FeedbackDetails = ({selectedWork }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const formatPrice = (price) => {
        return price?.toLocaleString("vi-VN", {
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
        <Box sx={styles.modal}>
            {/* Work information */}
            <Box sx={styles.informationTitle}>
                <AssignmentIcon size="small" sx={styles.subtitleIcon} />
                <Typography variant="h6" sx={styles.subtitle}>Thông tin ca làm</Typography>
            </Box>
            <Box sx={styles.informationContent}>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Dịch vụ</Typography>
                    <Typography sx={styles.content}>khách hàng chọn {selectedWork.serviceName}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Thông tin dịch vụ</Typography>
                    <Typography sx={styles.content}>Dọn {selectedWork.serviceDescription}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ngày làm việc</Typography>
                    <Typography sx={styles.content}>Bắt đầu lúc {selectedWork.startTime} ngày {selectedWork.date}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Khách hàng</Typography>
                    <Typography sx={styles.content}>{selectedWork.customerFullName}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Số điện thoại</Typography>
                    <Typography sx={styles.content}>{selectedWork.customerPhoneNumber}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Địa chỉ</Typography>
                    <Typography sx={styles.content}>{selectedWork.address}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Số lượng nhân viên</Typography>
                    <Typography sx={styles.content}>1 nhân viên làm trong {selectedWork.duration}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ghi chú</Typography>
                    <Typography sx={styles.content}>{selectedWork.note ? selectedWork.note : "Không có ghi chú"}</Typography>
                </Box>
            </Box>

            {/* Booking */}
            {/*<Box sx={styles.informationTitle}>*/}
            {/*    <LibraryBooksIcon size="small" sx={styles.subtitleIcon} />*/}
            {/*    <Typography variant="h6" sx={styles.subtitle}>Đơn hàng</Typography>*/}
            {/*</Box>*/}
            {/*<Box sx={styles.informationContent}>*/}
            {/*    <Box sx={styles.bookingContent}>*/}
            {/*        <Typography sx={styles.bookingTitle}>Số giờ/buổi</Typography>*/}
            {/*        <Typography sx={styles.content}>{selectedWork.duration}/buổi</Typography>*/}
            {/*    </Box>*/}
            {/*    <Box sx={styles.bookingContent}>*/}
            {/*        <Typography sx={styles.bookingTitle}>Tiền ca làm</Typography>*/}
            {/*        <Typography sx={styles.content}>{formatPrice(selectedWork.price)}</Typography>*/}
            {/*    </Box>*/}
            {/*    <Box sx={styles.bookingContent}>*/}
            {/*        <Typography sx={styles.bookingTitle}>Hoa hồng</Typography>*/}
            {/*        <Typography sx={styles.content}>{formatPrice(selectedWork.commission)}</Typography>*/}
            {/*    </Box>*/}
            {/*</Box>*/}

            {/*Feedback*/}
            <Box sx={styles.informationTitle}>
                <LibraryBooksIcon size="small" sx={styles.subtitleIcon} />
                <Typography variant="h6" sx={styles.subtitle}>Đánh giá của người dùng</Typography>
            </Box>
            <Box sx={styles.informationContent}>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Đánh giá</Typography>
                    <Typography sx={styles.content}>{selectedWork.rating} <StarIcon color="warning" fontSize="small" /></Typography>
                </Box>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Phản hồi</Typography>
                    <Typography sx={styles.content}>{selectedWork.content}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default FeedbackDetails;