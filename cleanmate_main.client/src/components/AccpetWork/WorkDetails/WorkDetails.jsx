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
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const WorkDetails = ({ selectWork, onWorkListRefresh, handleClose }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [connection, setConnection] = useState(null);
    const [workData, setWorkData] = useState(selectWork); // State to hold work data

    // Initialize SignalR connection
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('/workHub') // Ensure this matches your server's SignalR hub endpoint
            .withAutomaticReconnect()
            .configureLogging('debug') // Enable debug logging for SignalR
            .build();
        setConnection(newConnection);
    }, []);

    // Start SignalR connection and listen for updates
    useEffect(() => {
        if (connection) {
            connection.start()
                .catch(err => console.error('SignalR Connection Error: ', err));

            connection.on('ReceiveWorkUpdate', () => {
                fetchWorkDetails(); // Refetch data for this component
                if (onWorkListRefresh) onWorkListRefresh(); // Notify parent to refresh list
            });

            // Cleanup on unmount
            return () => {
                connection.off('ReceiveWorkUpdate');
                connection.stop();
            };
        }
    }, [connection, onWorkListRefresh]);

    // Fetch updated work details
    const fetchWorkDetails = async () => {
        try {
            const response = await fetch(`/worklist/${workData.bookingId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedWork = await response.json();
                setWorkData(updatedWork); // Update state with new data
            } else {
                console.error('Failed to fetch work details');
            }
        } catch (error) {
            console.error('Error fetching work details:', error);
        }
    };

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

    const openInGoogleMaps = () => {
        if (workData.address) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(workData.address)}`, '_blank');
        } else if (workData.latitude && workData.longitude) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${workData.latitude},${workData.longitude}`, '_blank');
        } else if (workData.placeID) {
            window.open(`https://www.google.com/maps/place/?q=place_id:${workData.placeID}`, '_blank');
        } else {
            toast.error("Không tìm thấy thông tin địa điểm.");
        }
    };

    const handleStartWork = async () => {
        try {
            const res = await fetch(`/work/${workData.bookingId}/start`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();
            if (res.ok && result.success) {
                toast.success('Bạn đã bắt đầu công việc.');
                fetchWorkDetails(); // Manual refresh as a fallback
                if (onWorkListRefresh) onWorkListRefresh(); // Trigger list refresh manually
                handleClose();
            } else {
                toast.error(result.message || 'Không thể bắt đầu công việc.');
            }
        } catch (error) {
            console.error('Lỗi khi bắt đầu công việc:', error);
            toast.error('Có lỗi xảy ra khi gọi API.');
        }
    };

    const handleCompleteWork = async () => {
        try {
            const response = await fetch(`/work/${workData.bookingId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success("Công việc đã được xác nhận hoàn thành!");
                fetchWorkDetails(); // Manual refresh as a fallback
                if (onWorkListRefresh) onWorkListRefresh(); // Trigger list refresh manually
                handleClose();
            } else {
                const error = await response.text();
                toast.error(`Có lỗi xảy ra: ${error}`);
            }
        } catch (error) {
            console.error("Error completing work:", error);
            toast.error("Không thể kết nối tới máy chủ.");
        }
    };
    const handleCancelWork = async () => {
        try {
            const response = await fetch(`/work/${workData.bookingId}/cancel`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                toast.success(result.message || 'Công việc đã được hủy thành công.');
                fetchWorkDetails(); // Refresh work details
                if (onWorkListRefresh) onWorkListRefresh(); // Notify parent to refresh list
                handleClose();
            } else {
                toast.error(result.message || 'Không thể hủy công việc.');
            }
        } catch (error) {
            console.error('Error canceling work:', error);
            toast.error('Đã xảy ra lỗi khi hủy công việc.');
        }
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
                    <Typography sx={styles.content}>khách hàng chọn {workData.serviceName}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Thông tin dịch vụ</Typography>
                    <Typography sx={styles.content}>Dọn {workData.serviceDescription}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ngày làm việc</Typography>
                    <Typography sx={styles.content}>Bắt đầu lúc {workData.startTime} ngày {workData.date}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Khách hàng</Typography>
                    <Typography sx={styles.content}>{workData.customerFullName}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Số điện thoại</Typography>
                    <Typography sx={styles.content}>{workData.customerPhoneNumber}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Địa chỉ</Typography>
                    <Typography sx={styles.content}>{workData.address}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Số lượng nhân viên</Typography>
                    <Typography sx={styles.content}>1 nhân viên làm trong {workData.duration}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography sx={styles.contentTitle}>Ghi chú</Typography>
                    <Typography sx={styles.content}>{workData.note ? workData.note : "Không có ghi chú"}</Typography>
                </Box>
            </Box>

            {/* Booking */}
            <Box sx={styles.informationTitle}>
                <LibraryBooksIcon size="small" sx={styles.subtitleIcon} />
                <Typography variant="h6" sx={styles.subtitle}>Đơn hàng</Typography>
            </Box>
            <Box sx={styles.informationContent}>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Số giờ/buổi</Typography>
                    <Typography sx={styles.content}>{workData.duration}/buổi</Typography>
                </Box>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Tiền ca làm</Typography>
                    <Typography sx={styles.content}>{formatPrice(workData.price)}</Typography>
                </Box>
                <Box sx={styles.bookingContent}>
                    <Typography sx={styles.bookingTitle}>Hoa hồng</Typography>
                    <Typography sx={styles.content}>{formatPrice(workData.commission)}</Typography>
                </Box>
            </Box>

            {/* Buttons based on status */}
            {workData.statusId === 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3, mb: 3, mx: 1 }}>
                    <Button variant="outlined" color="error"
                        onClick={() => setCancelConfirmOpen(true)}>
                        Hủy việc
                    </Button>
                    <Button variant="outlined" color="primary" onClick={openInGoogleMaps}>
                        Google Maps
                    </Button>
                    <Button variant="contained" sx={styles.confirmButton} onClick={handleStartWork}>
                        Bắt đầu làm
                    </Button>
                </Box>
            )}
            {workData.statusId === 4 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                    <Button variant="contained" color="success" onClick={() => setConfirmOpen(true)}>
                        Xác nhận hoàn thành công việc
                    </Button>
                </Box>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Xác nhận hoàn thành</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn đã hoàn thành công việc này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="error">
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            handleCompleteWork();
                            setConfirmOpen(false);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation Dialog for Cancellation */}
            <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)}>
                <DialogTitle>Xác nhận hủy việc</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn xác nhận muốn hủy việc?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelConfirmOpen(false)} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            handleCancelWork();
                            setCancelConfirmOpen(false);
                        }}
                        color="error"
                        variant="contained"
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkDetails;