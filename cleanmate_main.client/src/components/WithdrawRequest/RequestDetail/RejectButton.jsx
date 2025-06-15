import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const RejectButton = ({ requestId, onRejectSuccess }) => {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleOpenModal = () => {
        setIsRejectModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsRejectModalOpen(false);
        setRejectionReason(''); // Reset reason when closing
    };

    const handleReject = async () => {
        if (!requestId || !rejectionReason.trim()) return;

        const url = `withdrawrequest/${requestId}/reject`;
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
                handleCloseModal();
                if (onRejectSuccess) onRejectSuccess();
            } else {
                toast.error(result.message || 'Thao tác thất bại.');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Đã xảy ra lỗi khi xử lý yêu cầu.');
        }
    };

    return (
        <>
            <Button variant="outlined" color="error" onClick={handleOpenModal}>
                Từ chối
            </Button>

            <Dialog open={isRejectModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Hãy nhập lý do từ chối</DialogTitle>
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
                    <Button onClick={handleCloseModal} color="primary">
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
        </>
    );
};

export default RejectButton;