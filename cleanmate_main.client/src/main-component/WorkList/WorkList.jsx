import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    Tabs,
    Tab,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    IconButton,
    Pagination,
    Button,
    Modal,
    InputLabel,
    FormControl
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import 'bootstrap/dist/css/bootstrap.min.css';
import userImage from '../../images/user-image.png';
import { BookingStatusContext } from '../../context/BookingStatusProvider'

// Placeholder components for other pages
const ReportsPage = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h5">Reports Page</Typography>
        <Typography>This is a placeholder for the Reports page.</Typography>
    </Box>
);

const SettingsPage = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h5">Settings Page</Typography>
        <Typography>This is a placeholder for the Settings page.</Typography>
    </Box>
);

const WorkList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [status, setStatus] = useState('');
    const { statusList, loading } = useContext(BookingStatusContext);

    // Map frontend status strings to backend status IDs
    const statusMapping = {
        "Việc mới": 1, // BOOKING_STATUS_NEW
        "Đã huỷ": 2, // CANCEL
        "Đã nhận": 3, // ACCEPT
        "Đang thực hiện": 4, // IN_PROGRESS
        "Chờ xác nhận": 5, // PENDING_DONE
        "Hoàn thành": 6, // DONE
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1); // Reset to first page when status changes
    };

    useEffect(() => {
        const fetchWorkList = async () => {
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
                setData(workItems);
            } catch (error) {
                console.error('Error fetching work list:', error);
                if (error.message.includes('401')) {
                    navigate('/login');
                }
            }
        };

        fetchWorkList();
    }, [navigate, status]);

    const handleSort = useCallback((vietnameseKey) => {
        const keyMapping = {
            'tên': 'serviceName',
            'khách hàng': 'customerFullName',
            'giờ làm': 'startTime',
            'làm trong (tiếng)': 'duration',
            'địa chỉ': 'address',
            'ghi chú': 'note',
            'số tiền (VND)': 'totalPrice',
            'trạng thái': 'status',
        };

        let direction = 'asc';
        if (sortConfig.key === vietnameseKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        const englishKey = keyMapping[vietnameseKey] || vietnameseKey;

        const sortedData = [...data].sort((a, b) => {
            let valueA = a[englishKey];
            let valueB = b[englishKey];

            if (englishKey === 'startTime') {
                const dateTimeA = new Date(`${a.date}T${a.startTime}`);
                const dateTimeB = new Date(`${b.date}T${b.startTime}`);
                valueA = dateTimeA.getTime();
                valueB = dateTimeB.getTime();
            } else if (englishKey === 'totalPrice') {
                valueA = Number(valueA);
                valueB = Number(valueB);
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortConfig({ key: vietnameseKey, direction });
        setData(sortedData);
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            row.serviceName.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleLogout = () => {
        fetch('/api/authen/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            navigate('/login');
        });
    };

    const WorkListPage = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Tìm công việc theo tên"
                        variant="outlined"
                        size="small"
                        value={search ?? ''}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 200 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="status-select-label">Trạng thái</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={status}
                            onChange={handleStatusChange}
                            label="Trạng thái"
                        >
                            {statusList.map((statusItem) => (
                                <MenuItem key={statusItem.id} value={statusItem.id}>
                                    {statusItem.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <IconButton>
                        <FileDownload />
                    </IconButton>
                    <IconButton>
                        <FilterList />
                    </IconButton>
                    <Select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(e.target.value)}
                        size="small"
                        sx={{ ml: 1 }}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                    </Select>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="work list table">
                    <TableHead>
                        <TableRow>
                            {['tên', 'khách hàng', 'giờ làm', 'làm trong (tiếng)', 'địa chỉ', 'ghi chú', 'số tiền (VND)', 'trạng thái'].map((key) => (
                                <TableCell key={key}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                        <IconButton onClick={() => handleSort(key)} size="small">
                                            {sortConfig.key === key ? (
                                                sortConfig.direction === 'asc' ? (
                                                    <ArrowUpward fontSize="small" />
                                                ) : (
                                                    <ArrowDownward fontSize="small" />
                                                )
                                            ) : (
                                                <ArrowUpward fontSize="small" color="disabled" />
                                            )}
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            ))}
                            <TableCell>Xem trước</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row.bookingId}>
                                <TableCell>{row.serviceName}</TableCell>
                                <TableCell>{row.customerFullName}</TableCell>
                                <TableCell>{`${row.date} ${row.startTime}`}</TableCell>
                                <TableCell>{row.duration}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.note}</TableCell>
                                <TableCell>{row.totalPrice}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}>
                                    <VisibilityOutlinedIcon onClick={handleOpen} />
                                </TableCell>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    disableAutoFocus
                                >
                                    <Box sx={style.modal}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h5">Dọn dẹp nhà theo giờ</Typography>
                                            <Typography variant="body2" sx={style.lightGray}>Bắt đầu lúc: <span style={style.time}> Thứ 7 - 10:00 sáng</span></Typography>
                                        </Box>
                                        <Box sx={style.mainContent}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="body1" sx={style.lightGray}>Làm trong:</Typography>
                                                <Typography variant="h5" sx={{ color: '#FBA500' }}>2 giờ</Typography>
                                                <Typography variant="body1">2m² làm trong 2h</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="body1" sx={style.lightGray}>Số tiền (VND):</Typography>
                                                <Typography variant="h5" sx={{ color: '#FBA500' }}>100,000</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={style.lightGray}>Tại: <strong style={style.fontBlack}>Số nhà 30, Nguyễn Sơn, Long Biên, Hà Nội</strong></Typography>
                                            <Typography sx={style.lightGray}>Ghi chú: <strong style={style.fontBlack}>Chú ý nhà có mèo, dọn kỹ lông mèo</strong></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Button variant="outlined" color='error'>Từ chối</Button>
                                            <Button variant="outlined">Google Maps</Button>
                                            <Button variant="contained" sx={style.confirmButton}>Nhận việc</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(filteredData.length / rowsPerPage)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
                <Typography sx={{ ml: 2, alignSelf: 'center' }}>
                    {`${(page - 1) * rowsPerPage + 1} - ${Math.min(page * rowsPerPage, filteredData.length)} of ${filteredData.length}`}
                </Typography>
            </Box>
        </Box>
    );

    const renderPage = () => {
        switch (tabValue) {
            case 0:
                return <WorkListPage />;
            case 1:
                return <ReportsPage />;
            case 2:
                return <SettingsPage />;
            default:
                return <WorkListPage />;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        backgroundColor: '#f8f9fa',
                    },
                }}
            >
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab label="Danh sách công việc" />
                    <Tab label="Thu nhập" />
                    <Tab label="Settings" />
                </Tabs>
                <Button variant="outlined" onClick={handleLogout} sx={{ mt: 2, mx: 2 }}>
                    Đăng xuất
                </Button>
            </Drawer>

            <Box sx={{ flexGrow: 1, p: 2 }}>
                {renderPage()}
            </Box>
        </Box>
    );
};

const style = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '5px',
        p: 2,
    },
    mainContent: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '16px',
        p: 1,
    },
    confirmButton: {
        backgroundColor: '#1565C0',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#1565C0',
            color: '#fff',
        },
    },
    time: {
        color: '#FBA500',
        fontSize: '18px'
    },
    lightGray: {
        color: "#969495"
    },
    fontBlack: {
        color: '#000',
    },
};

export default WorkList;