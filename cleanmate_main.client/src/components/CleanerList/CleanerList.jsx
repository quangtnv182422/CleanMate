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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Modal
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import userAvatar from '../../images/user-image.png';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactLoading from 'react-loading';
import CleanerDetails from './CleanerDetails/CleanerDetails';

const CleanerList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cleanerId, setCleanerId] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleOpenModal = (row) => {
        setCleanerId(row.cleanerId);
        setOpenModal(true);
    }

    const hanleOpenConfirmation = (row) => {
        setSelectedEmployee(row);
        setOpenConfirmation(true);
    }

    const getEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/employeelist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleAvailability = async () => {
        if (!selectedEmployee.cleanerId) return;

        try {
            setLoading(true);
            const response = await fetch(`/employeelist/${selectedEmployee.cleanerId}/toggle-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(!selectedEmployee.available)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            toast.success(data.message);
            setOpenConfirmation(false);
            await getEmployees();
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái nhân viên.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEmployees();
    }, [getEmployees])

    const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });

    // Sử dụng sortConfig để sắp xếp dữ liệu
    const sortedData = useMemo(() => {
        const sortableData = [...employees].sort((a, b) => {
            if (!sortConfig.key) return 0;

            const keyMapping = {
                'nhân viên': 'fullName',
                'email': 'email',
                'số điện thoại': 'phoneNumber',
                'khu vực hoạt động': 'area',
                'kinh nghiệm': 'experienceYear',
                'tình trạng': 'available',
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
    }, [employees, sortConfig]);

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
                        label="Tìm kiếm theo tên nhân viên"
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
                            {['nhân viên', 'email', 'số điện thoại', 'khu vực hoạt động', 'kinh nghiệm', 'tình trạng'].map((key) => (
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
                                <TableCell>{row.area}</TableCell>
                                <TableCell>{row.experienceYear === 0 ? "Chưa có kinh nghiệm" : `${row.experienceYear} năm`}</TableCell>
                                <TableCell>
                                    <span style={{
                                        backgroundColor: row.available ? '#4CAF50' : '#F44336',
                                        color: '#FFFFFF',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                    }}>
                                        {row.available ? "Khả dụng" : "Không khả dụng"}
                                    </span>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Tooltip title="Xem chi tiết" arrow>
                                        <IconButton color="primary" size="small" onClick={() => handleOpenModal(row)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Thay đổi trạng thái" arrow>
                                        <IconButton color="warning" size="small" onClick={() => hanleOpenConfirmation(row)}>
                                            <EditIcon />
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
                    <CleanerDetails
                        cleanerId={cleanerId}
                        setOpenModal={setOpenModal}
                    />
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

            {openConfirmation && (
                <Dialog
                    open={openConfirmation}
                    onClose={() => setOpenConfirmation(false)}
                    disableAutoFocus
                >
                    <DialogTitle>
                        Thay đổi trạng thái nhân viên
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn thay đổi trạng thái của nhân viên này không?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={() => setOpenConfirmation(false)}>Hủy</Button>
                        <Button variant="contained" color="success" onClick={handleToggleAvailability}>Thay đổi</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    )
}

export default CleanerList;