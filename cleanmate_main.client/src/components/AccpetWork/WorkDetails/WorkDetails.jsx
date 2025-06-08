import {styles} from './style'
import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const WorkDetails = ({ selectWork }) => {
    console.log(selectWork)
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
                    <Typography sx={styles.content}>Bắt đầu lúc {selectWork.startTime} giờ ngày {formatDate(selectWork.date)}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Địa chỉ</Typography>
                    <Typography sx={styles.content}>{selectWork.address}</Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Nhân viên</Typography>
                    <Typography sx={styles.content}>{selectWork.employee} nhân viên làm trong {selectWork.duration}</Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ghi chú</Typography>
                    <Typography sx={styles.content}>{selectWork.note ? selectWork.note : "Không có ghi chú"}</Typography>
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
                    <Typography sx={styles.content}>{selectWork.duration}/buổi</Typography>
                </Box>

                {/*<Box sx={styles.bookingContent}>*/}
                {/*    <Typography sx={styles.bookingTitle}>Hình thức thanh toán</Typography>*/}
                {/*    <Typography sx={styles.content}>{selectWork.payment}</Typography>*/}
                {/*</Box>*/}

                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Tiền ca làm</Typography>
                    <Typography sx={styles.content}>{selectWork.price}</Typography>
                </Box>

                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Hoa hồng</Typography>
                    <Typography sx={styles.content}>{selectWork.commission}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default WorkDetails;