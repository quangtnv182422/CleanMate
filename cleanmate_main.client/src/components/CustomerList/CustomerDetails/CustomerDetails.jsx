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
import userAvatar from '../../../images/user-image.png';
import CloseIcon from '@mui/icons-material/Close';
import ReactLoading from 'react-loading';

const CustomerDetails = ({ customerId, setOpenModal }) => {
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const getCustomerDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/customerlist/${customerId}/detail`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setSelectedCustomer(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCustomerDetails();
    }, [getCustomerDetails])

    return (
        <>
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
                    <Avatar src={userAvatar || ''} alt={selectedCustomer?.fullName} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box>
                        <Typography sx={style.valueStyle}>{selectedCustomer?.fullName}</Typography>
                        <Typography sx={style.id}>{selectedCustomer?.id}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Email */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Email</Typography>
                    <Typography sx={style.valueStyle}>{selectedCustomer?.email}</Typography>
                </Box>

                {/* Phone */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Số điện thoại</Typography>
                    <Typography sx={style.valueStyle}>{selectedCustomer?.phoneNumber}</Typography>
                </Box>

                {/* Status */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Trạng thái</Typography>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            color: selectedCustomer?.isActive ? '#4CAF50' : '#F44336',
                        }}
                    >
                        {selectedCustomer?.isActive ? 'Đã kích hoạt' : 'Đã khóa'}
                    </Typography>
                </Box>
            </Box>
        </>
    )
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

export default CustomerDetails;