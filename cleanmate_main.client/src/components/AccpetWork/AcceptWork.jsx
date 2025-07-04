﻿import { useState, useEffect, useContext } from 'react';
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
import WorkDetails from './WorkDetails/WorkDetails.jsx';
import useAuth from '../../hooks/useAuth.jsx';
import { WorkContext } from '../../context/WorkProvider.jsx';
import * as signalR from '@microsoft/signalr'; // Import SignalR

const WORKS_PER_PAGE = 6;

const AcceptWork = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [work, setWork] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(3);
    const [selectedWork, setSelectedWork] = useState(null);
    const { statusList } = useContext(BookingStatusContext);
    const { user } = useAuth();
    const role = user?.roles?.[0] || '';
    const { setData } = useContext(WorkContext); // Access setData to update work list if needed
    const [connection, setConnection] = useState(null); // State for SignalR connection

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

    const fetchWorkList = async () => {
        if (role !== "Cleaner") return;
        try {
            const url = status
                ? `/worklist?status=${status}`
                : '/worklist';

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

    useEffect(() => {
        fetchWorkList();
    }, [status, role]);

    // Initialize SignalR connection
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
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
                .then(() => console.log('SignalR Connected Successfully'))
                .catch(err => console.error('SignalR Connection Error: ', err));

            connection.on('ReceiveWorkUpdate', () => {
                fetchWorkList(); // Refresh the work list on update
            });

            // Cleanup on unmount
            return () => {
                connection.off('ReceiveWorkUpdate');
                connection.stop();
            };
        }
    }, [connection]);

    const handleClose = () => {
        setOpen(false);
        setSelectedWork(null);
    };

    const filteredWork = work.filter((work) =>
        work.customerFullName.toLowerCase().includes(search.toLowerCase())
    );

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

    return (
        <Box sx={style.accpetWorkSection}>
            <Box className="container" sx={style.container}>
                <Box sx={{
                    display: 'flex',
                    gap: 2,

                    '@media (max-width: 400px)': {
                        gap: 0.5,
                    }
                }}
                >
                    <TextField
                        label="Tìm công việc theo tên"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: 150,

                            '@media (max-width: 414px)': {
                                width: 130,
                            },

                            '@media (max-width: 365px)': {
                                width: 115,
                            },
                            '@media (max-width: 350px)': {
                                width: 100, 
                            },

                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel id="status-select-label">Trạng thái</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={status}
                            onChange={handleStatusChange}
                            label="Trạng thái"
                        >
                            {statusList.filter((statusItem) => statusItem.id !== 2 && statusItem.id !== 6 && statusItem.id !== 1).map((statusItem) => (
                                <MenuItem key={statusItem.id} value={statusItem.id}>
                                    {statusItem.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedWork.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có công việc nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedWork.reverse().map((work, idx) => (
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
                                                    color: '#28A745',
                                                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                                    borderColor: '#28A745',
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
                        <WorkDetails selectWork={selectedWork} onWorkListRefresh={fetchWorkList} handleClose={handleClose} />
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
    );
};

export default AcceptWork;