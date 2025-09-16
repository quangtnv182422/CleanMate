import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
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
    Card,
    CardContent,
    Grid,
    FormControlLabel,
    Radio,
    RadioGroup,
    List,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { WorkContext } from '../../context/WorkProvider';
import { BookingStatusContext } from '../../context/BookingStatusProvider';
import { toast } from 'react-toastify';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import PaidIcon from '@mui/icons-material/Paid';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import userImage from '../../images/user-image.png';
import useAuth from '../../hooks/useAuth';
import EmployeeWorkDetails from '../../components/EmployeeWorkDetails/EmployeeWorkDetails';
import AccpetWork from '../../components/AccpetWork/AcceptWork';
import 'bootstrap/dist/css/bootstrap.min.css';
import PendingWork from '../../components/PendingWork/PendingWork';
import InProgressWork from '../../components/InProgressWork/InProgressWork';
import Revenue from '../../components/Revenue/Revenue';
import DepositCoin from '../../components/Coin/DepositCoin';
import WithdrawCoin from '../../components/Coin/WithdrawCoin';
import CleanerViewFeedback from '../../components/CleanerViewFeedback/CleanerViewFeedback';
import Profile from '../Profile/Profile';

// Placeholder components for other pages
const ReportsPage = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h5">Reports Page</Typography>
        <Typography>This is a placeholder for the Reports page.</Typography>
    </Box>
);


const colorMap = {
    'Việc mới': '#4DA8DA', // Việc mới - Xanh lam nhạt
    'Đã hủy': '#A9A9A9', // Đã hủy - Xám
    'Đã nhận': '#28A745', // Đã nhận - Xanh lá
    'Đang thực hiện': '#FF8C00', // Đang thực hiện - Cam
    'Chờ xác nhận': '#FFD700', // Chờ xác nhận - Vàng
    'Hoàn thành': '#004085'  // Hoàn thành - Xanh dương đậm
};

const WorkList = () => {
    const { open, handleOpen, handleClose, selectedWork, data, setData } = useContext(WorkContext);
    const { statusList } = useContext(BookingStatusContext);
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [status, setStatus] = useState('');
    const { user, loading } = useAuth();
    const role = user?.roles?.[0] || '';
    const [connection, setConnection] = useState(null);
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const fetchWorkList = useCallback(async () => {
        if (loading) return;
        if (!user || role !== 'Cleaner') {
            toast.error("Bạn không có quyền truy cập vào trang này");
            navigate('/home');
            return;
        }

        try {
            const url = `/worklist?status=1`;
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
    }, [loading, user, role, navigate, setData]);

    useEffect(() => {
        fetchWorkList();
    }, [fetchWorkList]);

    // Khởi tạo connection trong useEffect
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("/workHub")
            .build();
        setConnection(newConnection);
    }, []);

    // Kết nối và lắng nghe sự kiện
    useEffect(() => {
        if (connection) {
            if (connection.state === signalR.HubConnectionState.Disconnected) {
                connection.start()
                    .catch(err => console.error('SignalR Connection Error: ', err));
            }

            connection.on('ReceiveWorkUpdate', () => {
                fetchWorkList();
            });

            return () => {
                connection.off('ReceiveWorkUpdate');
                if (connection.state !== signalR.HubConnectionState.Disconnected) {
                    connection.stop();
                }
            };
        }
    }, [connection, fetchWorkList]);

    const handleLogout = () => {
        fetch('/Authen/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            navigate('/login');
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

    const WorkListPage = () => {
        const [search, setSearch] = useState('');

        // Mặc định sắp xếp theo createdAt (giảm dần)
        const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

        // Sử dụng sortConfig để sắp xếp dữ liệu
        const sortedData = useMemo(() => {
            const sortableData = [...data].sort((a, b) => {
                if (!sortConfig.key) return 0;

                let valueA = a[sortConfig.key];
                let valueB = b[sortConfig.key];

                if (sortConfig.key === 'createdAt') {
                    valueA = new Date(valueA).getTime();
                    valueB = new Date(valueB).getTime();
                }

                if (sortConfig.key === 'totalPrice') {
                    valueA = Number(valueA);
                    valueB = Number(valueB);
                }

                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });

            return sortableData;
        }, [data, sortConfig]);

        const filteredData = useMemo(() => {
            return sortedData.filter((row) =>
                row.customerFullName?.toLowerCase().includes(search.toLowerCase()) ||
                row.cleanerName?.toLowerCase().includes(search.toLowerCase())
            );
        }, [search, sortedData]);

        const paginatedData = useMemo(() => {
            const startIndex = (page - 1) * rowsPerPage;
            return filteredData.slice(startIndex, startIndex + rowsPerPage);
        }, [filteredData, page, rowsPerPage]);

        return (
            <Box sx={{ backgroundColor: "#fff" }}>
                <Box className="container" sx={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 16px',
                    '@media (max-width: 400px)': {
                        padding: '0 16px',
                    },
                }}>
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
                            maxWidth: '400px',
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
                                placeholder="Tìm kiếm theo tên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                inputProps={{ maxLength: 100 }}
                                sx={{
                                    maxWidth: 300,
                                    '& .MuiOutlinedInput-input': {
                                        padding: '10px 15px',
                                    },
                                    '@media (max-width: 600px)': {
                                        maxWidth: '100%',
                                    },
                                }}
                            />
                        </Box>
                        <Box>
                            <Select
                                value={sortConfig.key + '-' + sortConfig.direction}
                                onChange={(e) => {
                                    const [key, direction] = e.target.value.split('-');
                                    setSortConfig({ key, direction });
                                }}
                                size="small"
                                sx={{ ml: 1 }}
                            >
                                <MenuItem value="createdAt-desc">Mới nhất</MenuItem>
                                <MenuItem value="createdAt-asc">Cũ nhất</MenuItem>
                                <MenuItem value="totalPrice-asc">Giá thấp đến cao</MenuItem>
                                <MenuItem value="totalPrice-desc">Giá cao đến thấp</MenuItem>
                            </Select>
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
                </Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {paginatedData.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có công việc nào.
                            </Typography>
                        </Grid>
                    ) : (
                        paginatedData.map((work, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpen(work.bookingId)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Bắt đầu lúc <span style={style.dateTimeContent}>{formatTime(work.startTime)}</span> giờ ngày <span style={style.dateTimeContent}>{formatDate(work.date)}</span>
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>Khách hàng: <span style={{ fontWeight: 'bold' }}>{work.customerFullName}</span></Typography>
                                        <Typography variant="subtitle2" color="textSecondary">Dịch vụ: <span style={{ fontWeight: 'bold' }}>{work.serviceName}</span></Typography>
                                        <Typography variant="subtitle2" color="textSecondary">Địa chỉ: <span style={{ fontWeight: 'bold' }}>{work.addressNo}, {work.address}</span></Typography>
                                        <Typography variant="subtitle2" color="textSecondary">Ghi chú: <span style={{ fontWeight: 'bold' }}>{work.note ? work.note : "Không có ghi chú"}</span></Typography>
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(work.totalPrice)}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    border: `1px solid ${colorMap[work.status] || '#000000'}`, 
                                                    borderColor: colorMap[work.status] || '#000000',
                                                    borderRadius: '8px',
                                                    color: colorMap[work.status],
                                                    backgroundColor: '#EBF5FB',
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
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
    };

    const renderPage = () => {
        switch (tabValue) {
            case 0:
                return <WorkListPage />;
            case 1:
                return <AccpetWork />;
            case 2:
                return <PendingWork />
            case 3:
                return <InProgressWork />
            case 4:
                return <CleanerViewFeedback />
            case 5:
                return <Revenue />;
            case 6:
                return <DepositCoin />;
            case 7:
                return <WithdrawCoin />;
            case 8:
                return <Profile handleTabChange={handleTabChange} />
            default:
                return <WorkListPage />;
        }
    };

    const [coin, setCoin] = useState(0);

    useEffect(() => {
        const getCoin = async () => {
            try {
                const response = await fetch('/wallet/get-wallet', {
                    method: 'GET',
                    credentials: 'include',
                });

                const walletData = await response.json();
                setCoin(walletData?.balance);
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };

        getCoin();
    }, []);

    const [openDrawer, setOpenDrawer] = useState(false);
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
            title: 'Danh sách công việc',
            icon: <DnsOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Công việc đã nhận',
            icon: <PlaylistAddCheckOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Công việc đã hoàn thành',
            icon: <CheckIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Công việc đã hủy',
            icon: <CancelIcon sx={style.drawerIcon} />
        },
        {
            title: 'Đánh giá của khách hàng',
            icon: <ReviewsIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Thu nhập',
            icon: <CreditCardOutlinedIcon sx={style.drawerIcon} />,
        },
        {
            title: 'Nạp tiền',
            icon: <PaidIcon sx={style.drawerIcon} />,
            coin: coin,
        },
        {
            title: 'Rút tiền',
            icon: <CurrencyExchangeIcon sx={style.drawerIcon} />,
        },
    ];

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
                        width: 350,
                        boxSizing: 'border-box',
                        backgroundColor: '#fff',
                        color: '#ccc',

                        '@media (max-width: 600px)': {
                            width: 300,
                        }
                    },
                }}
            >
                <Box sx={style.userAvatar} onClick={() => handleTabChange(null, 8)}>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} sx={style.listItemText} />

                                {item.coin && (
                                    <Box sx={{ marginLeft: 'auto', paddingRight: 2, color: '#000' }}>
                                        Số dư ví: <span style={{ color: '#1976D2' }}>{formatPrice(item.coin)}</span>
                                    </Box>
                                )}
                            </Box>
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
                        startIcon={<ExitToAppOutlinedIcon sx={{ color: '#000' }} />}
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
    dateTimeContent: {
        color: '#1976D2',
        fontWeight: 'bold',
    },
    priceSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
    },
    workCard: {
        border: '1px solid #eee',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0 5px 8px rgba(0,0,0,0.5)',
            '@media (max-width: 600px)': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
            },
        },
    },
};

export default WorkList;