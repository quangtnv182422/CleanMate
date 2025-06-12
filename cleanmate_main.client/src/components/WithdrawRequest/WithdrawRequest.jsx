import { useState, useEffect } from 'react';
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
import RequestDetail from '../WithdrawRequest/RequestDetail/RequestDetail.jsx'


const statusList = [
    { id: 1, label: 'Đã duyệt', color: '#28A745', bgColor: 'rgba(40, 167, 69, 0.1)', borderColor: '#28A745' },
    { id: 2, label: 'Đã từ chối', color: '#DC3545', bgColor: 'rgba(220, 53, 69, 0.1)', borderColor: '#DC3545' },
    { id: 3, label: 'Đang chờ', color: '#FFC107', bgColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107' },
];

const REQUESTS_PER_PAGE = 6;

const WithdrawRequest = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState([
        {
            id: 'REQ001',
            createdDate: '2025-06-10',
            createdTime: '09:15',
            requesterName: 'Nguyễn Văn A',
            amount: 500000,
            statusId: 3,
            status: 'Đang chờ'
        },
        {
            id: 'REQ002',
            createdDate: '2025-06-10',
            createdTime: '10:45',
            requesterName: 'Trần Thị B',
            amount: 1200000,
            statusId: 1,
            status: 'Đã duyệt'
        },
        {
            id: 'REQ003',
            createdDate: '2025-06-11',
            createdTime: '08:30',
            requesterName: 'Lê Văn C',
            amount: 250000,
            statusId: 2,
            status: 'Đã từ chối'
        },
        {
            id: 'REQ004',
            createdDate: '2025-06-11',
            createdTime: '11:00',
            requesterName: 'Phạm Thị D',
            amount: 900000,
            statusId: 3,
            status: 'Đang chờ'
        },
        {
            id: 'REQ005',
            createdDate: '2025-06-11',
            createdTime: '14:20',
            requesterName: 'Hoàng Văn E',
            amount: 300000,
            statusId: 1,
            status: 'Đã duyệt'
        },
        {
            id: 'REQ006',
            createdDate: '2025-06-12',
            createdTime: '07:50',
            requesterName: 'Đặng Thị F',
            amount: 750000,
            statusId: 3,
            status: 'Đang chờ'
        },
        {
            id: 'REQ007',
            createdDate: '2025-06-12',
            createdTime: '10:10',
            requesterName: 'Bùi Văn G',
            amount: 600000,
            statusId: 2,
            status: 'Đã từ chối'
        },
        {
            id: 'REQ008',
            createdDate: '2025-06-12',
            createdTime: '12:00',
            requesterName: 'Ngô Thị H',
            amount: 1000000,
            statusId: 3,
            status: 'Đang chờ'
        },
        {
            id: 'REQ009',
            createdDate: '2025-06-12',
            createdTime: '15:30',
            requesterName: 'Vũ Văn I',
            amount: 450000,
            statusId: 1,
            status: 'Đã duyệt'
        },
        {
            id: 'REQ010',
            createdDate: '2025-06-12',
            createdTime: '16:45',
            requesterName: 'Lương Thị K',
            amount: 850000,
            statusId: 1,
            status: 'Đã duyệt'
        }
    ]);


    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(3);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filteredRequest = requests.filter((request) =>
        request.requesterName.toLowerCase().includes(search.toLowerCase()) &&
        request.statusId === status
    );

    const totalPages = Math.ceil(filteredRequest.length / REQUESTS_PER_PAGE);
    const displayedRequest = filteredRequest.slice(
        (page - 1) * REQUESTS_PER_PAGE,
        page * REQUESTS_PER_PAGE
    );

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1); // Reset to first page when status changes
    };

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN', {
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

    const handleOpen = (request) => {
        setSelectedRequest(request);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedRequest(null);
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
                    <FormControl size="small" sx={{ minWidth: 100 }}>
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

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedRequest.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có công việc nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedRequest.map((request, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpen(request)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Yêu cầu lúc {formatTime(request.createdTime)} giờ ngày {formatDate(request.createdDate)}
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>{request.requesterName}</Typography>
                                        {/*<Typography variant="subtitle2" color="textSecondary">{request.address}</Typography>*/}
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(request.amount)}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    ...style.status,
                                                    color: statusList.find(s => s.id === request.statusId)?.color,
                                                    backgroundColor: statusList.find(s => s.id === request.statusId)?.bgColor,
                                                    borderColor: statusList.find(s => s.id === request.statusId)?.borderColor,
                                                }}
                                            >
                                                {request.status}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>

                {open && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableAutoFocus
                    >
                        <RequestDetail selectedRequest={selectedRequest} handleClose={handleClose} />
                    </Modal>
                )}

                {/* Pagination */}
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
    )
}

export default WithdrawRequest;