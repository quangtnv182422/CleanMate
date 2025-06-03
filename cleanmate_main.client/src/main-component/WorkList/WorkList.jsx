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
    TextField,
    Select,
    MenuItem,
    IconButton,
    Pagination,
    Button,
    Modal,
    InputLabel,
    FormControl,
    List,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import 'bootstrap/dist/css/bootstrap.min.css';
import userImage from '../../images/user-image.png';
import { BookingStatusContext } from '../../context/BookingStatusProvider'
import useAuth from '../../hooks/useAuth';
import { WorkContext } from '../../context/WorkProvider';
import EmployeeWorkDetails from '../../components/EmployeeWorkDetails/EmployeeWorkDetails';

// Placeholder components for other pages
const ReportsPage = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h5">Reports Page</Typography>
        <Typography>This is a placeholder for the Reports page.</Typography>
    </Box>
);

const RevenuePage = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h5">Revenue Page</Typography>
        <Typography>This is a placeholder for the Revenue page.</Typography>
    </Box>
);

const drawerWidth = 300;

const WorkList = () => {
    const { open, handleOpen, handleClose, selectedWork, data, setData } = useContext(WorkContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [status, setStatus] = useState('');
    const { statusList } = useContext(BookingStatusContext);
    const { user, loading } = useAuth();
    const role = user?.roles?.[0] || '';

    console.log(data)

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1); // Reset to first page when status changes
    };

    useEffect(() => {
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
                setData(workItems);
            } catch (error) {
                console.error('Error fetching work list:', error);
            }
        };

        fetchWorkList();
    }, [setData, status, role]);

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
    }, [data, sortConfig, setData]);

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            row.serviceName.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

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
                                    <VisibilityOutlinedIcon onClick={() => handleOpen(row.bookingId)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedWork && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    disableAutoFocus
                >
                    <EmployeeWorkDetails />
                </Modal>
            )}

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
                return <RevenuePage />;
            case 3:
                return <RevenuePage />;
            default:
                return <WorkListPage />;
        }
    };

    const [openDrawer, setOpenDrawer] = useState(false);
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false)
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setOpenDrawer(false)
    };
    const menuItems = [
        {
            title: 'Danh sách công việc',
            icon: <DnsOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Công việc đã nhận',
            icon: <PlaylistAddCheckOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Thu nhập',
            icon: <CreditCardOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Settings',
            icon: <SettingsOutlinedIcon sx={style.drawerIcon} />,
        },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                open={openDrawer}
                onClose={handleCloseDrawer}
                variant="temporary" // giữ Drawer trên content
                anchor="left"
                modalProps={{
                    keepMounted: true, // giúp Drawer hoạt động tốt trên mobile
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
                <Box sx={style.userAvatar}>
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
                        onClick={handleLogout}
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
                        startIcon={<ExitToAppOutlinedIcon sx={{color: '#000'}} />}
                    >
                        Đăng xuất
                    </Button>
                </Box>
            </Drawer>

            <IconButton onClick={handleDrawerOpen}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 12,
                    zIndex: 1400
                }}
            >
                <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, pt: 3, pl: 8 }}>
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
    userAvatar: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        padding: 1.5,
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

export default WorkList;