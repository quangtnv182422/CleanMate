import { useState, useEffect, useContext } from 'react';
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
import { BookingStatusContext } from '../../context/BookingStatusProvider';
import StarIcon from '@mui/icons-material/Star';
import useAuth from '../../hooks/useAuth.jsx';
import FeedbackDetails from './FeedbackDetails/FeedbackDetails.jsx';

const WORKS_PER_PAGE = 6;

const CleanerViewFeedback = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [work, setWork] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(2); // Status 2 might represent "Done" or similar; adjust as needed
    const [selectedWork, setSelectedWork] = useState(null);
    const { statusList } = useContext(BookingStatusContext);
    const { user } = useAuth();
    const role = user?.roles?.[0] || '';

    const handleClose = () => setOpen(false);

    console.log(selectedWork)

    useEffect(() => {
        const fetchFeedbackHistory = async () => {
            if (role !== "Cleaner") return;
            try {
                const response = await fetch('viewfeedback/history', {
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
                if (result.success) {
                    console.log(result);
                    setWork(result.data); // Set the feedback history data
                } else {
                    console.error('Failed to fetch feedback history:', result.message);
                }
            } catch (error) {
                console.error('Error fetching feedback history:', error);
            }
        };

        fetchFeedbackHistory();
    }, [role]);

    const filteredWork = work.filter((work) => {
        return work.customerFullName.toLowerCase().includes(search.toLowerCase());
    });

    const totalPages = Math.ceil(filteredWork.length / WORKS_PER_PAGE);
    const displayedWork = filteredWork.slice(
        (page - 1) * WORKS_PER_PAGE,
        page * WORKS_PER_PAGE
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

    const handleOpenFeedbackDetails = (work) => {
        setSelectedWork(work);
        setOpen(true);
    };

    return (
        <Box sx={style.feedbackSection}>
            <Box className="container" sx={style.container}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Tìm công việc theo tên"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 200 }}
                    />
                    {/*<FormControl size="small" sx={{ minWidth: 160 }}>*/}
                    {/*    <InputLabel id="status-select-label">Trạng thái</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        labelId="status-select-label"*/}
                    {/*        value={status}*/}
                    {/*        onChange={handleStatusChange}*/}
                    {/*        label="Trạng thái"*/}
                    {/*    >*/}
                    {/*        {statusList*/}
                    {/*            .filter((statusItem) => statusItem.id !== 2 && statusItem.id !== 6 && statusItem.id !== 1)*/}
                    {/*            .map((statusItem) => (*/}
                    {/*                <MenuItem key={statusItem.id} value={statusItem.id}>*/}
                    {/*                    {statusItem.name}*/}
                    {/*                </MenuItem>*/}
                    {/*            ))}*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedWork.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có phản hồi nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedWork.map((work, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpenFeedbackDetails(work)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Bắt đầu lúc {formatTime(work.startTime)} ngày {formatDate(work.date)}
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>{work.customerFullName}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Đánh giá: <span>{work.rating} <StarIcon color="warning" fontSize="small" /></span>
                                        </Typography>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Phản hồi của khách hàng: <span style={{fontWeight: 'bold'}}>{work.content}</span>
                                        </Typography>
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(work.decimalPrice)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>

                {/*{open && (*/}
                {/*    <Modal*/}
                {/*        open={open}*/}
                {/*        onClose={handleClose}*/}
                {/*        disableAutoFocus*/}
                {/*    >*/}
                {/*        <FeedbackDetails selectedWork={selectedWork} handleClose={handleClose} />*/}
                {/*    </Modal>*/}
                {/*)}*/}

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
    );
};

export default CleanerViewFeedback;