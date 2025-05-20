import React, { useState } from 'react';
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
    const [data, setData] = useState([
        {
            name: 'Dọn dẹp theo giờ', 
            startTime: '2025-05-20 08:00', 
            duration: 2, 
            address: 'Số nhà 30 Bồ Đề, Bồ Đề, Long Biên, Hà Nội',
            notes: 'Mang theo dụng cụ lau kính', 
            payment: 169200, 
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-20 14:00',
            duration: 3,
            address: 'Số 15 Nguyễn Văn Cừ, Long Biên, Hà Nội',
            notes: 'Chú ý lau sạch bếp',
            payment: 240000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-21 09:00',
            duration: 2.5,
            address: 'Số 45 Ngọc Lâm, Long Biên, Hà Nội',
            notes: 'Không cần hút bụi',
            payment: 200000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-21 13:00',
            duration: 2,
            address: 'Số 10 Gia Thụy, Long Biên, Hà Nội',
            notes: 'Ưu tiên dọn phòng khách',
            payment: 180000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-22 10:00',
            duration: 4,
            address: 'Số 22 Nguyễn Sơn, Long Biên, Hà Nội',
            notes: 'Cần giặt thảm',
            payment: 320000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-22 15:00',
            duration: 2,
            address: 'Số 78 Phúc Lợi, Long Biên, Hà Nội',
            notes: 'Chỉ lau sàn',
            payment: 150000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-23 08:30',
            duration: 3,
            address: 'Số 33 Thạch Bàn, Long Biên, Hà Nội',
            notes: 'Mang thêm chổi mềm',
            payment: 250000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-23 11:00',
            duration: 2.5,
            address: 'Số 56 Cổ Linh, Long Biên, Hà Nội',
            notes: 'Dọn kỹ phòng ngủ',
            payment: 200000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-24 09:00',
            duration: 3.5,
            address: 'Số 19 Sài Đồng, Long Biên, Hà Nội',
            notes: 'Chú ý cửa sổ',
            payment: 280000,
        },
        {
            name: 'Dọn dẹp theo giờ',
            startTime: '2025-05-24 14:00',
            duration: 2,
            address: 'Số 88 Việt Hưng, Long Biên, Hà Nội',
            notes: 'Không cần lau bếp',
            payment: 160000,
        },
    ]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState(0); 

    
    const keyMapping = {
        'tên': 'name',
        'giờ làm': 'startDate', 
        'làm trong (tiếng)': 'duration', 
        'địa chỉ': 'company', 
        'ghi chú': 'notes', 
        'số tiền (VND)': 'salary',
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

            if (englishKey === 'salary') {
                valueA = parseFloat(valueA.replace(/[^0-9.-]+/g, '')); 
                valueB = parseFloat(valueB.replace(/[^0-9.-]+/g, ''));
            } else if (englishKey === 'startDate') {
                valueA = new Date(valueA).getTime(); 
                valueB = new Date(valueB).getTime();
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
        row.name.toLowerCase().includes(search.toLowerCase())
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
        fetch('/Authen/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            navigate('/home'); // hoặc gọi lại API /me
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
                            {['tên', 'giờ làm', 'làm trong (tiếng)', 'địa chỉ', 'ghi chú', 'số tiền (VND)'].map((key) => (
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
                            <TableRow key={row.name}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.startTime}</TableCell>
                                <TableCell>{row.duration}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.notes}</TableCell>
                                <TableCell>{row.payment}</TableCell>
                                <TableCell sx={{textAlign: 'center', cursor: 'pointer'} }><VisibilityOutlinedIcon /></TableCell>
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
                        boxSizing: 'border-box',
                        backgroundColor: '#f8f9fa',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" className="text-primary">
                        Bảng công việc
                    </Typography>
                </Box>
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab label="Danh sách công việc" className="border-bottom" />
                    <Tab label="Báo cáo" className="border-bottom" />
                    <Tab label="Settings" className="border-bottom" />
                </Tabs>
                <Button variant="outlined" onClick={handleLogout}>Đăng xuất</Button>
            </Drawer>

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {renderPage()}
            </Box>
        </Box>
    );
};

export default WorkList;