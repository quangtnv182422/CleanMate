import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
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
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
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

const drawerWidth = 300;

const WorkList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [status, setStatus] = useState('');
    const { statusList, loading } = useContext(BookingStatusContext);
    const [selectedWork, setSelectedWork] = useState(null);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1); // Reset to first page when status changes
    };
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
    console.log(selectedWork)

    const handleClose = () => {
        setOpen(false);
        setSelectedWork(null);
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
                    <Box sx={style.modal}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h5">{selectedWork.serviceName}</Typography>
                            <Typography variant="body2" sx={style.lightGray}>
                                Bắt đầu lúc: <span style={style.time}>{selectedWork.startTime} </span>ngày<span style={style.time}>  {selectedWork.date}</span>
                            </Typography>
                        </Box>
                        <Box sx={style.mainContent}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body1" sx={style.lightGray}>Làm trong:</Typography>
                                <Typography variant="h5" sx={{ color: '#FBA500' }}>{selectedWork.duration}</Typography>
                                <Typography variant="body1">{selectedWork.serviceDescription}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body1" sx={style.lightGray}>Số tiền:</Typography>
                                <Typography variant="h5" sx={{ color: '#FBA500' }}>{selectedWork.price}</Typography>
                                <Typography variant="body1"> Hoa hồng: {selectedWork.commission}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={style.lightGray}>Tại: <strong style={style.fontBlack}>{selectedWork.address}</strong></Typography>
                            <Typography sx={style.lightGray}>Ghi chú: <strong style={style.fontBlack}>{selectedWork.note}</strong></Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button variant="outlined" color='error'>Từ chối</Button>
                            <Button variant="outlined">Google Maps</Button>
                            <Button variant="contained" sx={style.confirmButton}>Nhận việc</Button>
                        </Box>
                    </Box>
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
                return <SettingsPage />;
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
                        padding: 1,
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#1565C0',
                        color: '#fff',
                    },
                }}
            >
                <List sx={{ width: '100%' }}>
                    {menuItems.map((item, index) => (
                        <ListItemButton
                            key={index}
                            selected={tabValue === index}
                            onClick={() => handleTabChange(null, index)}
                            sx={{padding: '10px 0'}}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    ))}
                </List>

                <Divider sx={{ backgroundColor: '#fff', my: 2 }} />

                <Button
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                        mt: 2,
                        borderColor: '#fff',
                        color: '#fff',
                        '&:hover': {
                            borderColor: '#aaa',
                            backgroundColor: '#222',
                        },
                    }}
                >
                    Đăng xuất
                </Button>
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
    time: {
        color: '#FBA500',
        fontSize: '18px'
    },
    drawerIcon: {
        minWidth: '40px',
        color: '#fff',
        marginRight: '5px',
    },
    lightGray: {
        color: "#969495"
    },
    fontBlack: {
        color: '#000',
    },
};

export default WorkList;