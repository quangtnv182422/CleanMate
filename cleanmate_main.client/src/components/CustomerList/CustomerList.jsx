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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Modal
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import ReactLoading from 'react-loading';

import { toast } from 'react-toastify';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    console.log(customers)

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
                'tên khách hàng': 'fullName',
                'số điện thoại': 'phoneNumber',
                'email': 'email',
                'trạng thái': 'isActive',
                'ngày tạo': 'createdDate',
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

            //setCustomers(prev =>
            //    prev.map((customer) =>
            //        customer.id === userId
            //            ? { ...customer, isActive: false }
            //            : customer
            //    )
            //);

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

            //setCustomers(prev =>
            //    prev.map((customer) =>
            //        customer.id === userId
            //            ? { ...customer, isActive: true }
            //            : customer
            //    )
            //);

            toast.success('Đã mở khóa tài khoản!');
        } catch (error) {
            console.error('Error unlocking customer:', error);
            toast.error('Không thể kích hoạt tài khoản khách hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    console.log(customers)


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
                            {['tên khách hàng', 'số điện thoại', 'email', 'trạng thái', 'ngày tạo'].map((key) => (
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
                            <TableCell>Xem chi tiết</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData?.map((row) => (
                            <TableRow key={row.bookingId}>
                                <TableCell>{row.fullName}</TableCell>
                                <TableCell>{row.phoneNumber}</TableCell>
                                <TableCell>{row.email}</TableCell>
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
                                <TableCell>{formatDate(row.createdDate)}</TableCell>
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
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <VisibilityIcon />
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

        </Box>
    );
}

export default CustomerList;