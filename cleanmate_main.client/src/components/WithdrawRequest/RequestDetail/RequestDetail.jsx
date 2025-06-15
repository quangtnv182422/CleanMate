import { styles } from './style';
import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import { toast } from 'react-toastify';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const RequestDetail = ({ selectedRequest, handleClose }) => {
    const formatPrice = (price) => {
        return price?.toLocaleString("vi-VN", {
            style: 'currency',
            currency: 'VND',
        });
    };

    const handleReject = async () => {
        if (!selectedRequest?.requestId) return;
        const url = `/withdrawrequest/${selectedRequest.requestId}/reject`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                toast.success('Yêu cầu đã bị từ chối');
                handleClose();
            } else {
                toast.error(result.message || 'Thao tác thất bại.');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Đã xảy ra lỗi khi xử lý yêu cầu.' + selectedRequest.requestId);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest?.requestId) return;
        const url = `/withdrawrequest/${selectedRequest.requestId}/accept`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                toast.success('Yêu cầu đã được duyệt');
                handleClose();
            } else {
                toast.error(result.message || 'Thao tác thất bại.');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Đã xảy ra lỗi khi xử lý yêu cầu.' + selectedRequest.requestId);
        }
    };

    const handleConfirmTransfer = async () => {
        if (!selectedRequest?.id) return;
        const url = `/withdrawrequest/${selectedRequest.requestId}/complete`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                toast.success('Xác nhận chuyển tiền thành công');
                handleClose();
            } else {
                toast.error(result.message || 'Thao tác thất bại.');
            }
        } catch (error) {
            console.error('Error confirming transfer:', error);
            toast.error('Đã xảy ra lỗi khi xử lý yêu cầu.' + selectedRequest.requestId );
        }
    };

    const imageUrl = selectedRequest
        ? `https://img.vietqr.io/image/${selectedRequest.user?.bankName || ''}-${selectedRequest.user?.bankNo || ''}-print.jpg?amount=${selectedRequest.amount || 0}Chuyen%20tien%20tu%20Cleanmate,%20request%20ID%20=%20${selectedRequest.requestId || ''}`
        : '';

    return (
        <Box sx={styles.modal}>
            {/* Request Information */}
            <Box sx={styles.informationTitle}>
                <LibraryBooksIcon size="small" sx={styles.subtitleIcon} />
                <Typography variant="h6" sx={styles.subtitle}>Yêu cầu</Typography>
            </Box>
            <Box sx={styles.informationContent}>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Nhân viên</Typography>
                    <Typography sx={styles.content}>{selectedRequest?.user.fullName}</Typography>
                </Box>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Số tiền</Typography>
                    <Typography sx={styles.content}>{formatPrice(selectedRequest?.amount)}</Typography>
                </Box>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Ngày tạo</Typography>
                    <Typography sx={styles.content}>{formatDate(selectedRequest?.createdDate)} {formatTime(selectedRequest?.createdTime)}</Typography>
                </Box>
            </Box>

            {/* Conditional Rendering Based on Status */}
            {selectedRequest?.status === 0 && (
                <Box sx={styles.confirmSection}>
                    <Button variant="outlined" color="error" onClick={handleReject}>
                        Từ chối
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleApprove}>
                        Duyệt
                    </Button>
                </Box>
            )}

            {selectedRequest?.status === 1 && (
                <Box sx={{ mt: 2 }}>
                    <img src={imageUrl} alt="QR Code" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                    <Button variant="contained" color="primary" onClick={handleConfirmTransfer}>
                        Xác nhận chuyển tiền
                    </Button>
                </Box>
            )}
        </Box>
    );
};

// Helper functions
const formatDate = (input) => {
    const date = new Date(input);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('vi-VN');
};

const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
};

export default RequestDetail;