import { styles } from './style';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const RequestDetail = ({ selectedRequest, handleClose }) => {
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [connection, setConnection] = useState(null);

    const formatPrice = (price) => {
        return price?.toLocaleString("vi-VN", {
            style: 'currency',
            currency: 'VND',
        });
    };


    const handleOpenRejectModal = () => {
        setOpenRejectModal(true);
    };

    const handleCloseRejectModal = () => {
        setOpenRejectModal(false);
        setRejectionReason(''); // Reset the reason when closing
    };

    const handleReject = async () => {
        if (!selectedRequest?.requestId || !rejectionReason.trim()) return;
        const url = `/withdrawrequest/${selectedRequest.requestId}/reject`;
        const body = JSON.stringify({ adminNote: rejectionReason });

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });
            const result = await response.json();
            if (response.ok && result.success) {
                toast.success('Yêu cầu đã bị từ chối');
                fetchRequestList();
                handleCloseRejectModal();
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
                fetchRequestList();
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
        if (!selectedRequest?.requestId) return;
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
                fetchRequestList();
                handleClose();
            } else {
                toast.error(result.message || 'Thao tác thất bại.');
            }
        } catch (error) {
            console.error('Error confirming transfer:', error);
            toast.error('Đã xảy ra lỗi khi xử lý yêu cầu.' + selectedRequest.requestId);
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
                    <Button variant="outlined" color="error" onClick={handleOpenRejectModal}>
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

            {/* Rejection Reason Modal */}
            <Dialog open={openRejectModal} onClose={handleCloseRejectModal}>
                <DialogTitle>Nhập lý do từ chối</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Lý do từ chối"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRejectModal} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleReject}
                        color="error"
                        disabled={!rejectionReason.trim()}
                    >
                        Xác nhận từ chối
                    </Button>
                </DialogActions>
            </Dialog>
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