import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Pagination,
    Button,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { style } from './style.js';
import RequestDetail from '../WithdrawRequest/RequestDetail/RequestDetail';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

// Updated status list with "Tất cả" (all) as -1 to avoid conflict with "Đang chờ" (0)
const statusList = [
    { id: -1, label: 'Tất cả', color: '#000000', bgColor: 'transparent', borderColor: '#000000' },
    { id: 0, label: 'Đang chờ', color: '#FFC107', bgColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107' },
    { id: 1, label: 'Đã duyệt', color: '#28A745', bgColor: 'rgba(40, 167, 69, 0.1)', borderColor: '#28A745' },
    { id: 2, label: 'Hoàn thành', color: '#28A745', bgColor: 'rgba(40, 167, 69, 0.1)', borderColor: '#28A745' },
    { id: 3, label: 'Đã từ chối', color: '#DC3545', bgColor: 'rgba(220, 53, 69, 0.1)', borderColor: '#DC3545' },
];

const REQUESTS_PER_PAGE = 6;

const WithdrawRequest = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(-1); // Default to "Tất cả" (-1)
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false); // Changed to false initially
    const [connection, setConnection] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const role = user?.roles?.[0] || '';

    const handleClose = () => {
        setOpen(false);
        setSelectedRequest(null);
    };

    const fetchRequestList = useCallback(async () => {
        if (authLoading) return; // Only check authLoading initially
        if (!user || role !== 'Admin') {
            toast.error("Bạn không có quyền truy cập vào trang này");
            navigate('/home');
            return;
        }

        console.log('Fetching request list...', { user, role }); // Debug log
        try {
            setLoading(true);
            const response = await fetch('/withdrawrequest', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result); // Debug log
            if (result.success) {
                setRequests(result.data || []);
            } else {
                console.error('Failed to fetch withdraw requests:', result.message);
                setRequests([]);
            }
        } catch (error) {
            console.error('Error fetching withdraw requests:', error);
        } finally {
            console.log('Loading complete'); // Debug log
            setLoading(false);
        }
    }, [authLoading, user, role, navigate]);

    // Initialize SignalR connection
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('/workHub')
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
        setConnection(newConnection);
    }, []);

    // Start connection and listen for updates
    useEffect(() => {
        if (connection) {
            if (connection.state === signalR.HubConnectionState.Disconnected) {
                connection.start()
                    .then(() => console.log('SignalR Connected'))
                    .catch(err => console.error('SignalR Connection Error:', err));
            }

            connection.on('ReceiveWorkUpdate', () => {
                console.log('Received WorkUpdate, refreshing list');
                fetchRequestList();
            });

            return () => {
                connection.off('ReceiveWorkUpdate');
                if (connection.state !== signalR.HubConnectionState.Disconnected) {
                    connection.stop()
                        .then(() => console.log('SignalR Disconnected'))
                        .catch(err => console.error('Error stopping SignalR:', err));
                }
            };
        }
    }, [connection, fetchRequestList]);

    // Fetch initial data
    useEffect(() => {
        fetchRequestList();
    }, [fetchRequestList]);

    // Updated filter logic to handle "Tất cả" (-1) and safeguard against undefined values
    const filteredRequest = requests.filter((request) => {
        const nameMatch = (request?.user?.fullName || request?.requesterName || '').toLowerCase().includes(search.toLowerCase());
        const statusMatch = status === -1 || (request?.status !== undefined && request.status === status);
        return nameMatch && statusMatch;
    });

    const totalPages = Math.ceil(filteredRequest.length / REQUESTS_PER_PAGE);
    const displayedRequest = filteredRequest.slice(
        (page - 1) * REQUESTS_PER_PAGE,
        page * REQUESTS_PER_PAGE
    );

    const handleStatusChange = (event) => {
        setStatus(parseInt(event.target.value));
        setPage(1); // Reset to first page when status changes
    };

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const formatTime = (dateTime) => {
        if (!dateTime) return '';
        const cleanDateTime = dateTime.split('.')[0]; // Remove milliseconds
        const date = new Date(cleanDateTime);
        if (isNaN(date)) return '';
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return '';
        const cleanDateTime = dateTime.split('.')[0]; // Remove milliseconds
        const date = new Date(cleanDateTime);
        if (isNaN(date)) return '';
        return date.toLocaleDateString('vi-VN');
    };

    const handleOpen = (request) => {
        setSelectedRequest(request);
        setOpen(true);
    };

    // Callback to refresh list from RequestDetail
    const refreshList = () => {
        fetchRequestList();
    };

    return (
        <Box sx={style.withdrawRequestSection}>
            <Box className="container" sx={style.container}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Tìm theo tên nhân viên"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 150 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="status-select-label">Trạng thái</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={status}
                            onChange={handleStatusChange}
                            label="Trạng thái"
                        >
                            {statusList.map((statusItem) => (
                                <MenuItem key={statusItem.id} value={statusItem.id}>
                                    {statusItem.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                        Đang tải dữ liệu...
                    </Typography>
                ) : displayedRequest.length === 0 ? (
                    <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                        Hiện tại chưa có yêu cầu nào.
                    </Typography>
                ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {displayedRequest.map((request, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpen(request)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Yêu cầu lúc {formatTime(request.requestedAt)} giờ ngày {formatDate(request.requestedAt)}
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>
                                            {request.user?.fullName || request.requesterName || 'N/A'}
                                        </Typography>
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(request.amount)}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    ...style.status,
                                                    color: statusList.find(s => s.id === request.status)?.color || '#000000',
                                                    backgroundColor: statusList.find(s => s.id === request.status)?.bgColor || 'transparent',
                                                    borderColor: statusList.find(s => s.id === request.status)?.borderColor || '#000000',
                                                }}
                                            >
                                                {statusList.find(s => s.id === request.status)?.label || 'Không xác định'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {open && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableAutoFocus
                    >
                        <RequestDetail
                            selectedRequest={selectedRequest}
                            handleClose={handleClose}
                            onActionComplete={refreshList} // Pass callback to refresh list
                        />
                    </Modal>
                )}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default WithdrawRequest;