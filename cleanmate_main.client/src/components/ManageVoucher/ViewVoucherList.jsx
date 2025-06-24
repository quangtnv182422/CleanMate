import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
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
    Modal,
    Select,
    MenuItem,
    IconButton,
    Pagination,
    Button,
    Chip,
    Divider,
    TextField,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    ListItemText,
    List,
    ListItem,
    ListItemIcon,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VoucherForm from './VoucherForm/VoucherForm';
import PeopleIcon from '@mui/icons-material/People';
import { WorkContext } from '../../context/WorkProvider';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ViewVoucherList = () => {
    const { customers, setCustomers } = useContext(WorkContext)
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [openVoucherDetails, setOpenVoucherDetails] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const token = localStorage.getItem('token');

    // Trạng thái cho Dialog gán khách hàng
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [currentVoucherId, setCurrentVoucherId] = useState(null);
    const [tempSelectedCustomers, setTempSelectedCustomers] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [isMultiAssign, setIsMultiAssign] = useState(false);

    // Trạng thái lưu danh sách id của customers được chọn cho mỗi voucher
    const [selectedByVoucher, setSelectedByVoucher] = useState({});

    const assignCustomerToVoucher = async (voucherId, customerId) => {
        try {
            setLoading(true);
            const response = await fetch(`/managevoucher/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    voucherId: voucherId,
                    userId: customerId
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi gán khách hàng');
            }

            const data = await response.json();
            toast.success('Gán khách hàng thành công!');
            await getVouchers();
            return data;
        } catch (error) {
            console.error('Lỗi khi gán khách hàng:', error);
            toast.error(error.message || 'Có lỗi xảy ra!');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const assignMultipleCustomersToVoucher = async (voucherId, customerIds) => {
        try {
            setLoading(true);
            const response = await fetch(`/managevoucher/assign-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    voucherId: voucherId,
                    UserIds: customerIds,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi gán nhiều khách hàng');
            }

            const data = await response.json();
            toast.success('Gán nhiều khách hàng thành công!');
            await getVouchers();
            return data;
        } catch (error) {
            console.error('Lỗi khi gán nhiều khách hàng:', error);
            toast.error(error.message || 'Có lỗi xảy ra!');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý mở Dialog gán khách hàng
    const handleOpenAssignDialog = (voucherId) => {
        if (!customers || customers.length === 0) {
            toast.error('Không có khách hàng để gán!');
            return;
        }
        setCurrentVoucherId(voucherId);
        const assignedCustomerIds = selectedByVoucher[voucherId] || [];
        setTempSelectedCustomers(assignedCustomerIds);
        setCustomerSearch('');
        setOpenAssignDialog(true);
    };

    // Hàm xử lý đóng Dialog
    const handleCloseAssignDialog = () => {
        setOpenAssignDialog(false);
        setCurrentVoucherId(null);
        setTempSelectedCustomers([]);
        setCustomerSearch('');
    };

    // Hàm xử lý thay đổi lựa chọn khách hàng trong Dialog
    const handleCustomerToggle = (customerId) => {
        setTempSelectedCustomers((prev) =>
            prev.includes(customerId)
                ? prev.filter((id) => id !== customerId)
                : isMultiAssign ? [...prev, customerId] : [customerId]
        );
    };

    // Hàm xử lý chọn tất cả/bỏ chọn tất cả trong Dialog
    const handleToggleSelectAllCustomers = () => {
        const allSelected = filteredCustomers.every((customer) =>
            tempSelectedCustomers.includes(customer.id)
        );

        if (allSelected) {
            setTempSelectedCustomers([]);
        } else {
            setTempSelectedCustomers(
                filteredCustomers.map((customer) => customer.id)
            );
        }
    };

    // Hàm xử lý lưu lựa chọn khách hàng
    const handleSaveCustomers = async () => {
        if (!tempSelectedCustomers.length) {
            toast.error('Vui lòng chọn ít nhất một khách hàng!');
            return;
        }
        try {
            if (isMultiAssign) {
                await assignMultipleCustomersToVoucher(currentVoucherId, tempSelectedCustomers);
                setSelectedByVoucher((prev) => ({
                    ...prev,
                    [currentVoucherId]: tempSelectedCustomers,
                }));
            } else {
                await assignCustomerToVoucher(currentVoucherId, tempSelectedCustomers[0]);
                setSelectedByVoucher((prev) => ({
                    ...prev,
                    [currentVoucherId]: [tempSelectedCustomers[0]],
                }));
            }
            handleCloseAssignDialog();
        } catch (error) {
            console.error('Lỗi khi lưu:', error);
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) =>
            customer.fullName.toLowerCase().includes(customerSearch.toLowerCase())
        );
    }, [customers, customerSearch]);

    const handleOpenConfirmDelete = (row) => {
        setSelectedVoucher(row);
        setOpenConfirmDelete(true);
    }

    const handleOpenVoucherDetails = row => {
        handleGetVoucherDetails(row.voucherId);
        setOpenVoucherDetails(true)
    }

    const getVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/managevoucher', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch vouchers');
            }

            const data = await response.json();
            setVouchers(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [])

    const handleGetVoucherDetails = async (voucherId) => {
        try {
            setLoading(true);
            const response = await fetch(`/managevoucher/${voucherId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch vouchers');
            }

            const data = await response.json();
            setSelectedVoucher(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getVouchers();
    }, [getVouchers])

    const handleDeleteVoucher = async (voucherId) => {
        const assigned = selectedByVoucher[voucherId];
        if (assigned && assigned.length > 0) {
            toast.warning(`Voucher đã được gán cho ${assigned.length} khách hàng. Không thể xóa!`);
            return;
        }
        try {
            const response = await fetch(`/managevoucher/${voucherId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete voucher');
            }
            // Refresh the voucher list after deletion
            await getVouchers();
            toast.success("Bạn đã xóa voucher!")
        } catch (error) {
            console.error('Error deleting voucher:', error);
        }
    }

    const handleSubmitVoucher = async (data) => {
        try {
            const method = editingVoucher ? 'PUT' : 'POST';
            const url = editingVoucher ? `/managevoucher/${editingVoucher.voucherId}` : '/managevoucher';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gửi voucher');
            }

            toast.success(editingVoucher ? "Cập nhật voucher thành công!" : "Tạo voucher thành công!");
            setOpenForm(false);
            await getVouchers();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra!');
        }
    };

    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Sử dụng sortConfig để sắp xếp dữ liệu
    const sortedData = useMemo(() => {
        const sortableData = [...vouchers].sort((a, b) => {
            if (!sortConfig.key) return 0;

            const keyMapping = {
                'mã giảm giá': 'voucherCode',
                'ngày hết hạn': 'expireDate',
                'giảm giá (%)': 'discountPercentage',
                'mô tả': 'description',
                'voucher sự kiện': 'isEventVoucher',
                'được tạo bởi': 'createdBy',
                'trạng thái': 'status',
                'createdAt': 'createdAt',
            };

            const englishKey = keyMapping[sortConfig.key] || sortConfig.key;
            let valueA = a[englishKey];
            let valueB = b[englishKey];

            if (englishKey === 'createdAt') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB?.toLowerCase();
            } else if (englishKey === 'expireDate') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            }

            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sortableData;
    }, [vouchers, sortConfig]);

    const filteredData = useMemo(() => {
        return sortedData.filter((row) =>
            row.voucherCode?.toLowerCase().includes(search.toLowerCase())
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

    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        return `${hour}:${minute}`;
    };

    const renderStatusChip = (status) => {
        switch (status) {
            case 0:
                return <Chip label="Hoạt động" color="success" size="small" />;
            case 1:
                return <Chip label="Hết hạn" color="warning" size="small" />;
            case 2:
                return <Chip label="Đã khóa" color="default" size="small" />;
            default:
                return <Chip label="UNKNOWN" color="error" size="small" />;
        }
    };

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
                        label="Tìm kiếm theo mã giảm giá"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        inputProps={{ maxLength: 100 }}
                        fullWidth
                        sx={{
                            maxWidth: 210,
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
                    <Button
                        variant="outlined"
                        sx={{ fontSize: '12px' }}
                        startIcon={<AddIcon size="small" />}
                        onClick={() => {
                            setEditingVoucher(null);
                            setOpenForm(true);
                        }}
                    >
                        Tạo voucher
                    </Button>
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
                            {['mã giảm giá', 'ngày hết hạn', 'giảm giá (%)', 'mô tả', 'voucher sự kiện', 'được tạo bởi', 'trạng thái'].map((key) => (
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
                            <TableCell>Gán cho</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData?.map((row) => (
                            <TableRow key={row.voucherId}>
                                <TableCell>{row.voucherCode}</TableCell>
                                <TableCell>{formatDate(row.expireDate)}</TableCell>
                                <TableCell>{row.discountPercentage}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.isEventVoucher ? "Có" : "Không"}</TableCell>
                                <TableCell>{row.createdBy}</TableCell>
                                <TableCell>{renderStatusChip(row.status)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<PeopleIcon />}
                                        onClick={() => handleOpenAssignDialog(row.voucherId)}
                                    >
                                        {
                                            Array.isArray(selectedByVoucher[row?.voucherId]) && selectedByVoucher[row?.voucherId].length > 0
                                                ? `${selectedByVoucher[row.voucherId].length} khách hàng`
                                                : 'Chưa gán'
                                        }
                                    </Button>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Tooltip title="Xem chi tiết" arrow>
                                        <IconButton color="primary" size="small" onClick={() => handleOpenVoucherDetails(row)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Chỉnh sửa" arrow>
                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() => {
                                                setEditingVoucher(row);
                                                setOpenForm(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa" arrow>
                                        <IconButton color="error" size="small" onClick={() => handleOpenConfirmDelete(row)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
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

            <Dialog
                open={openAssignDialog}
                onClose={handleCloseAssignDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Gán khách hàng cho voucher</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isMultiAssign}
                                    onChange={(e) => setIsMultiAssign(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Gán nhiều khách hàng"
                        />
                    </Box>
                    <TextField
                        fullWidth
                        label="Tìm kiếm khách hàng"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleToggleSelectAllCustomers}
                        sx={{ mb: 2 }}
                        disabled={!isMultiAssign}
                    >
                        {filteredCustomers.every((customer) =>
                            tempSelectedCustomers.includes(customer.id)
                        )
                            ? 'Bỏ chọn tất cả'
                            : 'Chọn tất cả'}
                    </Button>
                    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {filteredCustomers && filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <ListItem
                                    key={customer.id}
                                    dense
                                    onClick={() => handleCustomerToggle(customer.id)}
                                    selected={tempSelectedCustomers.includes(customer.id)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={tempSelectedCustomers.includes(customer.id)}
                                            disableRipple
                                            disabled={!isMultiAssign && tempSelectedCustomers.length >= 1}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={customer.fullName} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography>Không tìm thấy khách hàng</Typography>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAssignDialog}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveCustomers}
                        disabled={loading || (!isMultiAssign && !tempSelectedCustomers.length) || (!isMultiAssign && tempSelectedCustomers.length > 1)}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {openConfirmDelete && (
                <>
                    <Dialog
                        open={openConfirmDelete}
                        onClose={() => setOpenConfirmDelete(false)}
                        disableAutoFocus
                    >
                        <DialogTitle>Xóa mã giảm giá</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">Bạn có chắn chắn muốn xóa mã giảm giá này?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={() => setOpenConfirmDelete(false)} color="primary">
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleDeleteVoucher(selectedVoucher?.voucherId);
                                    setOpenConfirmDelete(false);
                                }}
                                color="error"
                            >
                                Xóa
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
            {openVoucherDetails && (
                <>
                    <Modal
                        open={openVoucherDetails}
                        onClose={() => setOpenVoucherDetails(false)}
                        aria-labelledby="voucher-modal-title"
                        aria-describedby="voucher-modal-description"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            width: { xs: '90%', sm: '400px' },
                            boxShadow: 2,
                            color: 'text.primary',
                        }}>
                            <Typography id="voucher-modal-title" variant="h5" component="h2" gutterBottom sx={{ m: 2, textAlign: 'center', color: '#1565C0' }}>
                                {selectedVoucher?.voucherCode}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', p: 1, borderRadius: 1, mb: 2, mx: 2 }}>
                                <TextField
                                    value={selectedVoucher?.voucherCode}
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    sx={{ flexGrow: 1, fontWeight: 'bold' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigator.clipboard.writeText(selectedVoucher?.voucherCode)}
                                    sx={{ ml: 1 }}
                                >
                                    Copy
                                </Button>
                            </Box>

                            <Divider />

                            <Box sx={{ my: 2, p: 2 }}>
                                <Typography variant="body1"><strong>Mô tả:</strong> {selectedVoucher?.description}.</Typography>
                                <Typography variant="body1"><strong>Ngày hết hạn:</strong> {formatDate(selectedVoucher?.expireDate)}</Typography>
                                <Typography variant="body1"><strong>Voucher sự kiện:</strong> {selectedVoucher?.isEventVoucher ? "Có" : "Không"}</Typography>
                                <Typography variant="body1"><strong>Được tạo bởi:</strong> {selectedVoucher?.createdBy}</Typography>
                                <Typography variant="body1"><strong>Trạng thái:</strong> {renderStatusChip(selectedVoucher?.status)}</Typography>
                            </Box>
                        </Box>
                    </Modal>
                </>
            )}

            <VoucherForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleSubmitVoucher}
                initialData={editingVoucher}
            />
        </Box>

    );
}

export default ViewVoucherList;