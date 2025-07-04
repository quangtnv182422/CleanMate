﻿import { useState, useEffect, useContext } from 'react'
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
import { style } from './style.js'
import { BookingStatusContext } from '../../context/BookingStatusProvider';
import useAuth from '../../hooks/useAuth.jsx';
import { WorkContext } from '../../context/WorkProvider.jsx';
import WorkDetails from '../../components/AccpetWork/WorkDetails/WorkDetails.jsx'

const WORKS_PER_PAGE = 6;

const InProgressWork = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [work, setWork] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(2);
    const [selectedWork, setSelectedWork] = useState(null);
    const { statusList } = useContext(BookingStatusContext);
    const { user } = useAuth();
    const role = user?.roles?.[0] || '';

    const handleOpen = async (bookingId) => {
        try {
            const response = await fetch(`/worklist/${bookingId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`HTTP error! status: ${response.status}, response: ${text}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const workDetail = await response.json();
            setSelectedWork(workDetail);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching work detail:', error);
        }
    };

    useEffect(() => {
        const fetchWorkList = async () => {
            if (role !== "Cleaner") return;
            try {
                const url = status
                    ? `/worklist?status=${status}`
                    : '/worklist'

                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const workItems = await response.json();
                setWork(workItems);

            } catch (error) {
                console.error('Error fetching work list:', error);
            }
        };

        fetchWorkList();
    }, [setWork, role, status]);

    const handleClose = () => setOpen(false);

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
        })
    };

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
        <Box sx={style.inProgressWorkSection}>
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
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedWork.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có công việc nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedWork.map((work, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpen(work.bookingId)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Bắt đầu lúc <span style={style.dateTimeContent}>{formatTime(work.startTime)}</span> giờ ngày <span style={style.dateTimeContent}>{formatDate(work.date)}</span>
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>{work.customerFullName}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary">{work.address}</Typography>
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(work.totalPrice)}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    ...style.status,
                                                    color: '#E4293D',
                                                    backgroundColor: '#FCE8EA',
                                                    borderColor: '#E4293D',
                                                }}
                                            >
                                                {work.status}
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
                        <WorkDetails selectWork={selectedWork} />
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

export default InProgressWork;