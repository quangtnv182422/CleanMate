import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
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
    TextField,
    Tooltip,
    Divider,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Modal
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import userAvatar from '../../images/user-image.png';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ReactLoading from 'react-loading';


const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);

    const handleCustomerDetail = (customer) => {
        setSelectedCustomer(customer);
        setOpenModal(true);
    }

    const getCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/customerlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCustomers();
    }, [getCustomers])

    const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });

    // Sử dụng sortConfig để sắp xếp dữ liệu
    const sortedData = useMemo(() => {
        const sortableData = [...customers].sort((a, b) => {
            if (!sortConfig.key) return 0;

            const keyMapping = {
                'khách hàng': 'fullName',
                'email': 'email',
                'số điện thoại': 'phoneNumber',
                'ngày tạo': 'createdDate',
                'trạng thái': 'isActive',
            };

            const englishKey = keyMapping[sortConfig.key] || sortConfig.key;
            let valueA = a[englishKey];
            let valueB = b[englishKey];


            if (englishKey === 'createdDate') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB?.toLowerCase();
            }

            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sortableData;
    }, [customers, sortConfig]);

    const filteredData = useMemo(() => {
        return sortedData.filter((row) =>
            row.fullName?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, sortedData]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const handleSort = useCallback((vietnameseKey) => {
        let direction = 'asc';
        if (sortConfig.key === vietnameseKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: vietnameseKey, direction });
    }, [sortConfig]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleLock = async (userId, isActive) => {
        if (!isActive) return; // Không cho phép khóa nếu đã khóa

        try {
            setLoading(true);
            const response = await fetch(`/customerlist/${userId}/lock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to lock customer account');
            }

            await getCustomers();

            toast.success("Đã khóa tài khoản!");
        } catch (error) {
            console.error('Error locking customer:', error);
            toast.error('Không thể khóa tài khoản khách hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnLock = async (userId, isActive) => {
        if (isActive) return; // Không cho phép kích hoạt nếu đã kích hoạt

        try {
            setLoading(true);
            const response = await fetch(`/customerlist/${userId}/unlock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to unlock customer account');
            }


            await getCustomers();

            toast.success('Đã mở khóa tài khoản!');
        } catch (error) {
            console.error('Error unlocking customer:', error);
            toast.error('Không thể kích hoạt tài khoản khách hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {loading && (
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '1000',
                }}>
                    <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
                </Box>
            )}
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
                    maxWidth: '200px',
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
                        label="Tìm kiếm theo tên khách hàng"
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
                            {['khách hàng', 'email', 'số điện thoại', 'ngày tạo', 'trạng thái'].map((key) => (
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
                            <TableCell>Thay đổi trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData?.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}>
                                        <img
                                            src={row.avatar || userAvatar}
                                            alt="Avatar"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />

                                        {row.fullName}
                                    </Box>
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.phoneNumber}</TableCell>
                                <TableCell>{formatDate(row.createdDate)}</TableCell>
                                <TableCell>
                                    <span style={{
                                        backgroundColor: row.isActive ? '#4CAF50' : '#F44336',
                                        color: '#FFFFFF',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                    }}>
                                        {row.isActive ? "Đã kích hoạt" : "Đã khóa"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        startIcon={row.isActive ? <LockIcon /> : <LockOpenIcon />}
                                        onClick={() => {
                                            if (row.isActive) {
                                                handleLock(row.id, row.isActive);
                                            } else {
                                                handleUnLock(row.id, row.isActive);
                                            }
                                        }}
                                    >
                                        {row.isActive ? "Khóa" : "Kích hoạt"}
                                    </Button>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Tooltip title="Xem chi tiết" arrow>
                                        <IconButton color="primary" size="small" onClick={() => handleCustomerDetail(row)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Chỉnh sửa" arrow>
                                        <IconButton color="warning" size="small">
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa" arrow>
                                        <IconButton color="error" size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

            {openModal && (
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    disableAutoFocus
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 3,
                    }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#122B82' }}>
                                Thông tin khách hàng
                            </Typography>
                            <IconButton onClick={() => setOpenModal(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Avatar + Name + ID */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar src={userAvatar || ''} alt={selectedCustomer.fullName} sx={{ width: 48, height: 48, mr: 2 }} />
                            <Box>
                                <Typography sx={style.valueStyle}>{selectedCustomer.fullName}</Typography>
                                <Typography sx={style.id}>{selectedCustomer.id}</Typography>
                            </Box>
                        </Box>

                        {/* Email */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography sx={style.labelStyle}>Email</Typography>
                            <Typography sx={style.valueStyle}>{selectedCustomer.email}</Typography>
                        </Box>

                        {/* Phone */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography sx={style.labelStyle}>Số điện thoại</Typography>
                            <Typography sx={style.valueStyle}>{selectedCustomer.phoneNumber}</Typography>
                        </Box>

                        {/* Status */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography sx={style.labelStyle}>Trạng thái</Typography>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    color: selectedCustomer.isActive ? '#4CAF50' : '#F44336',
                                }}
                            >
                                {selectedCustomer.isActive ? 'Đã kích hoạt' : 'Đã khóa'}
                            </Typography>
                        </Box>
                    </Box>
                </Modal>
            )}

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
        </Box>
    );
}

const style = {
    id: {
        fontSize: '0.8rem',
        color: '#888',
    },
    labelStyle: {
        fontSize: '0.8rem',
        color: '#888',
        marginTop: 1,
    },
    valueStyle: {
        fontWeight: 500,
    },
};

export default CustomerList;