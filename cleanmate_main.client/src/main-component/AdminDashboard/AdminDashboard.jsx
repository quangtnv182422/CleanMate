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
    FormControl,
    InputLabel,
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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import useAuth from '../../hooks/useAuth';
import userImage from '../../images/user-image.png';
import { BookingStatusContext } from '../../context/BookingStatusProvider';
import WithdrawRequest from '../../components/WithdrawRequest/WithdrawRequest';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Dashboard from '../../components/Dashboard/Dashboard';

const drawerWidth = 300;

const colorMap = {
    'Việc mới': '#4DA8DA',          // Xanh lam nhạt
    'Đã huỷ': '#F00',            // Đỏ
    'Đã nhận': '#0077B6',           // Xanh lam đậm hơn 'Việc mới'
    'Đang thực hiện': '#800080',    // Tím
    'Chờ xác nhận': '#FFD700',      // Vàng
    'Hoàn thành': '#28A745',        // Xanh lá
};

const UserList = () => {
    return <h1>UserList</h1>
}

const CleanerList = () => {
    return <h1>CleanerList</h1>
}

const AdminDashboard = () => {
    const navigate = useNavigate();

    const { statusList } = useContext(BookingStatusContext);
    const { user, loading } = useAuth();

    const [status, setStatus] = useState(0);
    const [page, setPage] = useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [data, setData] = useState([]);
    const [cleaners, setCleaners] = useState([]);
    const [selectedCleaner, setSelectedCleaner] = useState({});
    const [selectedWork, setSelectedWork] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const role = user?.roles?.[0];

    const fetchBooking = useCallback(async () => {
        if (loading) return;
        if (!user || role !== 'Admin') {
            toast.error("Bạn không có quyền truy cập vào trang này");
            navigate('/home');
            return;
        }

        try {
            const url = status
                ? `/managebooking/get-booking-admin?status=${status}`
                : '/managebooking/get-booking-admin';
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
            toast.error("Lỗi khi tải danh sách công việc!");
        }
    }, [loading, user, role, navigate, status]);

    const handleSelectWork = (work) => {
        setSelectedWork(work);
        setOpenConfirm(true);
    }

    const getCleaners = async () => {
        try {
            const response = await fetch('/managebooking/get-cleaners', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cleanersData = await response.json();
            setCleaners(cleanersData);
        } catch (error) {
            console.error('Error fetching cleaners:', error);
            toast.error("Lỗi khi tải danh sách nhân viên!");
        }
    }

    useEffect(() => {
        fetchBooking();
        getCleaners();
    }, [fetchBooking]);

    const handleSelectCleaner = (bookingId, e) => {
        const selectedCleanerObj = cleaners.find(cleaner => cleaner.cleanerId === e.target.value);
        setSelectedCleaner((prev) => ({
            ...prev,
            [bookingId]: selectedCleanerObj,
        }));
    };

    const handleAssignCleaner = async () => {
        if (!selectedWork || !selectedCleaner[selectedWork.bookingId]) {
            toast.error("Vui lòng chọn nhân viên trước khi giao việc!");
            return;
        }

        const { bookingId } = selectedWork;
        const cleanerId = selectedCleaner[bookingId].cleanerId;
        const cleanerName = selectedCleaner[bookingId].name;

        try {
            const response = await fetch('/managebooking/assign-cleaner', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId,
                    cleanerId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the data state to reflect the assigned cleaner
            setData((prevData) =>
                prevData.map((item) =>
                    item.bookingId === bookingId
                        ? { ...item, cleanerId, cleanerName }
                        : item
                )
            );

            toast.success("Giao việc thành công!");
            setOpenConfirm(false);
            setSelectedCleaner((prev) => {
                const newSelected = { ...prev };
                delete newSelected[bookingId]; // Clear selection after assignment
                return newSelected;
            });
        } catch (error) {
            console.error('Error assigning cleaner:', error);
            toast.error("Bạn không thể thực hiện giao việc cho người này!");
        }
    }

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
            title: 'Dashboard',
            icon: <DashboardIcon sx={style.drawerIcon} />,
        },
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
        {
            title: 'Yêu cầu rút tiền',
            icon: <CurrencyExchangeIcon sx={style.drawerIcon} />
        }
    ];

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

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1);
    };

    const WorkListPage = () => {
        const [search, setSearch] = useState('');
        const [openConfirm, setOpenConfirm] = useState(false);
        const [selectedBooking, setSelectedBooking] = useState(null);

        const sortedByCreatedAt = useMemo(() => {
            return [...data].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // công việc mới nhất lên đầu
            });
        }, []);

        const handleOpenConfirm = (booking) => {
            setSelectedBooking(booking);
            setOpenConfirm(true)
        }
        
        const filteredData = useMemo(() => {
            return sortedByCreatedAt.filter((row) =>
                row.customerFullName?.toLowerCase().includes(search.toLowerCase()) ||
                row.cleanerName?.toLowerCase().includes(search.toLowerCase())
            );
        }, [search, sortedByCreatedAt]);

        const paginatedData = useMemo(() => {
            const startIndex = (page - 1) * rowsPerPage;
            return filteredData.slice(startIndex, startIndex + rowsPerPage);
        }, [filteredData]);

        const handleSort = useCallback((vietnameseKey) => {
            const keyMapping = {
                'tên': 'serviceName',
                'khách hàng': 'customerFullName',
                'người dọn': 'cleanerName',
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

                if (englishKey === 'cleanerName') {
                    valueA = valueA || 'Chưa phân công';
                    valueB = valueB || 'Chưa phân công';
                }
                if (englishKey === 'note') {
                    valueA = valueA || 'không có ghi chú';
                    valueB = valueB || 'không có ghi chú';
                }

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
                    valueB = valueB?.toLowerCase();
                }

                if (valueA < valueB) return direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return direction === 'asc' ? 1 : -1;
                return 0;
            });

            setSortConfig({ key: vietnameseKey, direction });
            setData(sortedData);
        }, []);

        const handleCancelWork = async (bookingId) => {
            try {
                const response = await fetch(`/managebooking/cancel-booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ bookingId }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                toast.success("Công việc đã được hủy thành công!");
                fetchBooking();
            } catch (error) {
                console.error('Error canceling work:', error);
                toast.error("Lỗi khi hủy công việc!");
            }
        }

        return (
            <Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    '@media (max-width: 915px)': {
                        width: '100%',
                        justifyContent: 'flex-start',
                        mt: 1,
                    },
                }}>
                    <Box sx={{
                        maxWidth: '460px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                    >
                        <TextField
                            key="search-input"
                            type="text"
                            name="search"
                            label="Tìm kiếm theo tên khách hàng hoặc nhân viên"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            inputProps={{ maxLength: 100 }}
                            fullWidth
                            sx={{
                                maxWidth: 300,
                                '& .MuiOutlinedInput-input': {
                                    padding: '10px 5px',
                                },
                                '@media (max-width: 600px)': {
                                    maxWidth: '100%',
                                },
                            }}
                        />
                        <FormControl size="small" sx={{ width: '60%' }}>
                            <InputLabel id="status-select-label">Trạng thái</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={status}
                                onChange={handleStatusChange}
                                label="Trạng thái"
                            >
                                <MenuItem value={0}>
                                    Tất cả công việc
                                </MenuItem>
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
                                {['tên', 'khách hàng', 'người dọn', 'giờ làm', 'làm trong', 'địa chỉ', 'ghi chú', 'số tiền', 'trạng thái'].map((key) => (
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
                                <TableCell>Hủy việc</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((row) => (
                                <TableRow key={row.bookingId}>
                                    <TableCell>{row.serviceName}</TableCell>
                                    <TableCell>{row.customerFullName}</TableCell>
                                    <TableCell>{row.cleanerName || 'Chưa phân công'}</TableCell>
                                    <TableCell>{`${formatDate(row.date)} (${formatTime(row.startTime)})`}</TableCell>
                                    <TableCell>{row.duration} tiếng</TableCell>
                                    <TableCell sx={{ maxWidth: 160 }}>{row.address}</TableCell>
                                    <TableCell>{row.note || "không có ghi chú"}</TableCell>
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
                                        <FormControl size="large" sx={{ width: '100%' }}>
                                            <InputLabel id="status-select-label">Nhân viên</InputLabel>
                                            <Select
                                                labelId="status-select-label"
                                                value={selectedCleaner[row.bookingId]?.cleanerId || row.cleanerId || ''}
                                                onChange={(e) => handleSelectCleaner(row.bookingId, e)}
                                                label="Nhân viên"
                                                sx={{ minWidth: 120, textAlign: 'left' }}
                                            >
                                                {cleaners.map((cleaner) => (
                                                    <MenuItem
                                                        key={cleaner.cleanerId}
                                                        value={cleaner.cleanerId}
                                                        onClick={() => handleSelectWork(row)}
                                                    >
                                                        {cleaner.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="error" sx={style.cancelButton} onClick={() => handleOpenConfirm(row)}>Hủy việc</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={Math.ceil(filteredData?.length / rowsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                    <Typography sx={{ ml: 2, alignSelf: 'center' }}>
                        {`${(page - 1) * rowsPerPage + 1} - ${Math.min(page * rowsPerPage, filteredData?.length)} of ${filteredData?.length}`}
                    </Typography>
                </Box>
                {openConfirm && (
                    <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                        <DialogTitle>Xác nhận hủy công việc</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Bạn có chắc chắn muốn hủy công việc này của khách hàng <span style={{ fontWeight: 'bold' }}>{selectedBooking?.customerFullName}</span>?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={() => setOpenConfirm(false)}>Hủy</Button>
                            <Button variant="contained" color="primary" onClick={() => handleCancelWork(selectedBooking.bookingId)}>Đồng ý</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        )
    };

    const renderPage = () => {
        switch (tabValue) {
            case 0:
                return <Dashboard />
            case 1:
                return <WorkListPage />;
            case 2:
                return <UserList />
            case 3:
                return <CleanerList />
            case 4:
                return <WithdrawRequest />
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
            {openConfirm && (
                <Dialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                >
                    <DialogTitle>
                        Xác nhận giao việc
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn giao việc này cho nhân viên {selectedCleaner[selectedWork?.bookingId]?.name || 'Chưa chọn'}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={() => setOpenConfirm(false)}>Hủy</Button>
                        <Button variant="contained" color="primary" onClick={handleAssignCleaner}>Đồng ý</Button>
                    </DialogActions>
                </Dialog>
            )}
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
    cancelButton: {
        width: '100%',
        padding: '15px 5px',
        fontSize: 11,
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