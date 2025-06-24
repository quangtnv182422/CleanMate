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

const CleanerDetails = ({ cleanerId, setOpenModal }) => {
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    console.log(cleanerId)

    const getEmployeeDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/employeelist/${cleanerId}/detail`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setSelectedEmployee(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getEmployeeDetails();
    }, [getEmployeeDetails])

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
                        Thông tin nhân viên
                    </Typography>
                    <IconButton onClick={() => setOpenModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Avatar + Name + ID */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={userAvatar || ''} alt={selectedEmployee?.fullName} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box>
                        <Typography sx={style.valueStyle}>{selectedEmployee?.fullName}</Typography>
                        <Typography sx={style.id}>Mã nhân viên: {selectedEmployee?.cleanerId}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Email */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Email</Typography>
                    <Typography sx={style.valueStyle}>{selectedEmployee?.email}</Typography>
                </Box>

                {/* Phone */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Số điện thoại</Typography>
                    <Typography sx={style.valueStyle}>{selectedEmployee?.phoneNumber}</Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Kinh nghiệm</Typography>
                    <Typography sx={style.valueStyle}>{selectedEmployee?.experienceYear === 0 ? "Chưa có kinh nghiệm" : selectedEmployee?.experienceYear}</Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Khu vực hoạt động</Typography>
                    <Typography sx={style.valueStyle}>{selectedEmployee?.area}</Typography>
                </Box>

                {/* Status */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Trạng thái</Typography>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            color: selectedEmployee?.available ? '#4CAF50' : '#F44336',
                        }}
                    >
                        {selectedEmployee?.available ? 'Khả dụng' : 'Không khả dụng'}
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

export default CleanerDetails;