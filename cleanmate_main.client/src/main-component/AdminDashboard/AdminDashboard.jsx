import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    IconButton,
    Pagination,
    Button,
    List,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import CheckIcon from '@mui/icons-material/Check';
import useAuth from '../../hooks/useAuth';
import userImage from '../../images/user-image.png';

const drawerWidth = 300;

const colorMap = {
    'Việc mới': '#4DA8DA', // Việc mới - Xanh lam nhạt
    'Đã hủy': '#A9A9A9', // Đã hủy - Xám
    'Đã nhận': '#28A745', // Đã nhận - Xanh lá
    'Đang thực hiện': '#FF8C00', // Đang thực hiện - Cam
    'Chờ xác nhận': '#FFD700', // Chờ xác nhận - Vàng
    'Hoàn thành': '#004085'  // Hoàn thành - Xanh dương đậm
};

const array = new Array(10).fill().map((_, index) => ({
    "address": "390 Đ. Nguyễn Văn Cừ, Ngõc Lâm, Long Biên, Hà Nội, Vietnam",
    "bookingId": 1,
    "customerFullName": "Hoang Tien",
    "date": "2025-05-24",
    "duration": 1,
    "note": "First time booking",
    "serviceName": "Dọn nhà theo giờ",
    "startTime": "08:00:00",
    "status": "Việc mới",
    "totalPrice": 250000
}));

const UserList = () => {
    return <h1>UserList</h1>
}

const CleanerList = () => {
    return <h1>CleanerList</h1>
}

const AdminDashboard = () => {
    const { user, loading } = useAuth();
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const role = user?.roles?.[0];
    console.log(role)
    useEffect(() => {
        if (loading) return;
        if (!user || role !== 'Admin') {
            toast.error("Bạn không có quyền truy cập vào trang này");
            navigate('/home');
            return;
        }
        setData(array)
    }, [navigate, role, user, loading])

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setOpenDrawer(false);
    };

    const menuItems = [
        {
            title: 'Bảng công việc',
            icon: <DnsOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Danh sách người dùng',
            icon: <PeopleIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Danh sách nhân viên',
            icon: <PeopleIcon sx={style.drawerIcon} />,
        },
    ];
    const handleSort = useCallback((vietnameseKey) => {
        const keyMapping = {
            'tên': 'serviceName',
            'khách hàng': 'customerFullName',
            'giờ làm': 'startTime',
            'làm trong': 'duration',
            'địa chỉ': 'address',
            'ghi chú': 'note',
            'số tiền': 'totalPrice',
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
    }, [data, sortConfig, setData]);

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            row.serviceName?.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const handleLogout = () => {
        fetch('/Authen/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
           navigate('/login')
        });
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        return `${hour}:${minute}`;
    };

    const WorkListPage = () => (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: 1,
                '@media (max-width: 915px)': {
                    width: '100%',
                    justifyContent: 'flex-start',
                    mt: 1,
                },
            }}>
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

            <TableContainer component={Paper} sx={{
                overflowX: 'auto',
                maxWidth: '100%',
                '& .MuiTable-root': {
                    minWidth: 915,
                },
                '@media (max-width: 915px)': {
                    width: '100vw',
                    marginLeft: '-16px',
                    marginRight: '-16px',
                },
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="work list table">
                    <TableHead>
                        <TableRow>
                            {['tên', 'khách hàng', 'giờ làm', 'làm trong', 'địa chỉ', 'ghi chú', 'số tiền', 'trạng thái'].map((key) => (
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
                            <TableCell>Phân công</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row.bookingId}>
                                <TableCell>{row.serviceName}</TableCell>
                                <TableCell>{row.customerFullName}</TableCell>
                                <TableCell>{`${formatDate(row.date)} (${formatTime(row.startTime)})`}</TableCell>
                                <TableCell>{row.duration} tiếng</TableCell>
                                <TableCell sx={{maxWidth: 160} }>{row.address}</TableCell>
                                <TableCell>{row.note}</TableCell>
                                <TableCell>{formatPrice(row.totalPrice)}</TableCell>
                                <TableCell>
                                    <span
                                        style={{
                                            backgroundColor: colorMap[row.status] || '#000000',
                                            color: '#FFFFFF',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {row.status}
                                    </span>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Select label="Nhân viên">
                                        <MenuItem value={1}>Hoàng Tiến Dũng</MenuItem>
                                        <MenuItem value={2}>Nguyễn Tùng Lâm</MenuItem>
                                        <MenuItem value={3}>Trương Nguyễn Việt Quang</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
                return <UserList />
            case 2:
                return <CleanerList />
            default:
                return <WorkListPage />;
        }
    };
    return (
        <Box sx={{ display: 'flex', mr: 1, mb: 2 }}>
            <Drawer
                open={openDrawer}
                onClose={handleCloseDrawer}
                variant="temporary"
                anchor="left"
                modalProps={{
                    keepMounted: true,
                }}
                sx={{
                    zIndex: 1400,
                    '& .MuiDrawer-paper': {
                        padding: 0,
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#fff',
                        color: '#ccc',
                    },
                }}
            >
                <Box sx={style.userAvatar} onClick={() => navigate('/profile')}>
                    <img src={userImage} alt="Avatar của người dùng" />
                    <Box>
                        <Typography sx={style.userFullName}>{user?.fullName}</Typography>
                        <Typography>{user?.email}</Typography>
                    </Box>
                </Box>
                <List sx={{ width: '100%', padding: 0 }}>
                    {menuItems.map((item, index) => (
                        <ListItemButton
                            key={index}
                            selected={tabValue === index}
                            onClick={() => handleTabChange(null, index)}
                            sx={{ padding: '10px 0' }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} sx={style.listItemText} />
                        </ListItemButton>
                    ))}
                </List>

                <Divider sx={{ backgroundColor: '#999', my: 2 }} />

                <Box sx={{ padding: '0 10px' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            width: '100%',
                            mt: 2,
                            borderColor: '#000',
                            color: '#000',
                            '&:hover': {
                                borderColor: '#aaa',
                                backgroundColor: '#f1f1f1',
                            },
                        }}
                        startIcon={<ExitToAppOutlinedIcon sx={{ color: '#000' }} />}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </Box>
            </Drawer>

            <IconButton
                onClick={handleDrawerOpen}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 12,
                    zIndex: 1400
                }}
            >
                <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, pt: 3, pl: 8, mb: 2 }}>
                {renderPage()}
            </Box>
        </Box>
    )
}

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
    userAvatar: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        padding: 1.5,
        cursor: 'pointer',
        'img': {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
        }
    },
    userFullName: {
        fontWeight: 'bold',
    },
    time: {
        color: '#FBA500',
        fontSize: '18px'
    },
    drawerIcon: {
        minWidth: '40px',
        color: '#000',
        marginRight: '5px',
    },
    listItemText: {
        color: '#000'
    },
    lightGray: {
        color: "#969495"
    },
    fontBlack: {
        color: '#000',
    },
};

export default AdminDashboard;