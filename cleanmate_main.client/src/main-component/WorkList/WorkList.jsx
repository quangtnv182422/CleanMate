import React, { useState,useEffect } from 'react';
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
    Button
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import 'bootstrap/dist/css/bootstrap.min.css';
import userImage from '../../images/user-image.png';

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
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchWorkList = async () => {
            try {
                const response = await fetch('/Worklist', {
                    method: 'GET',
                    credentials: 'include', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch work list');
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
    }, [navigate]);

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

    const handleSort = (vietnameseKey) => {
        let direction = 'asc';
        if (sortConfig.key === vietnameseKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: vietnameseKey, direction });

        const englishKey = keyMapping[vietnameseKey] || vietnameseKey;

        const sortedData = [...data].sort((a, b) => {
            let valueA = a[englishKey];
            let valueB = b[englishKey];

            // Special handling for startTime (combine Date and StartTime)
            if (englishKey === 'startTime') {
                const dateA = new Date(a.date);
                const timeA = a.startTime.split(':').map(Number);
                dateA.setHours(timeA[0], timeA[1], timeA[2]);

                const dateB = new Date(b.date);
                const timeB = b.startTime.split(':').map(Number);
                dateB.setHours(timeB[0], timeB[1], timeB[2]);

                valueA = dateA.getTime();
                valueB = dateB.getTime();
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

        setData(sortedData);
    };

    // Filter data by search
    const filteredData = data.filter((row) =>
        row.serviceName.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const paginatedData = filteredData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    // Handle tab change
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
                <TextField
                    label="Tìm công việc theo tên"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 200 }}
                />
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
                                <TableCell>{`${row.date.split('T')[0]} ${row.startTime}`}</TableCell>
                                <TableCell>{row.duration}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.note}</TableCell>
                                <TableCell>{row.totalPrice}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}>
                                    <VisibilityOutlinedIcon onClick={() => navigate(`/work-details/${row.bookingId}`)} />
                                </TableCell>
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

export default WorkList;