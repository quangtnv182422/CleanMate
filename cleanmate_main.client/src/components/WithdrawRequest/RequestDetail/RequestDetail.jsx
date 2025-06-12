import { styles } from './style';
import { useState, useEffect } from 'react';
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const RequestDetail = ({ selectedRequest, handleClose }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const formatPrice = (price) => {
        return price?.toLocaleString("vi-VN", {
            style: 'currency',
            currency: 'VND',
        });
    };

    const handleConfirmOpen = () => {
        setConfirmOpen(true);
    }

    return (
        <Box sx={styles.modal}>
            {/* Work information */}
            {/*<Box sx={styles.informationTitle}>*/}
            {/*    <AssignmentIcon size="small" sx={styles.subtitleIcon} />*/}
            {/*    <Typography variant="h6" sx={styles.subtitle}>Thông tin ca làm</Typography>*/}
            {/*</Box>*/}
            {/*<Box sx={styles.informationContent}>*/}
            {/*    <Box sx={{ mb: 1 }}>*/}
            {/*        <Typography sx={styles.contentTitle}>Nhân viên</Typography>*/}
            {/*        <Typography sx={styles.content}>khách hàng chọn {selectedRequest.serviceName}</Typography>*/}
            {/*    </Box>*/}
            {/*</Box>*/}

             {/*Booking */}
            <Box sx={styles.informationTitle}>
                <LibraryBooksIcon size="small" sx={styles.subtitleIcon} />
                <Typography variant="h6" sx={styles.subtitle}>Yêu cầu</Typography>
            </Box>
            <Box sx={styles.informationContent}>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Nhân viên</Typography>
                    <Typography sx={styles.content}>{selectedRequest.requesterName}</Typography>
                </Box>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Số tiền</Typography>
                    <Typography sx={styles.content}>{formatPrice(selectedRequest.amount)}</Typography>
                </Box>
            </Box>

            <Box sx={styles.confirmSection}>
                <Button variant="outlined" color="error" onClick={() => setConfirmOpen(false)}>Từ chối</Button>
                <Button variant="contained" color="primary" onClick={handleConfirmOpen}>Duyệt</Button>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Xác nhận yêu cầu</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn duyệt yêu cầu này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="error">
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirmOpen(false);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Duyệt yêu cầu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RequestDetail;