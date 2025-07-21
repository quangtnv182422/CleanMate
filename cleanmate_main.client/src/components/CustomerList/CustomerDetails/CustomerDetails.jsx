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
import FeedbackList from './FeedbackList';

const CustomerDetails = ({ customerId, setOpenModal }) => {
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    console.log(selectedCustomer);

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
    }, [customerId]);

    useEffect(() => {
        getCustomerDetails();
    }, [getCustomerDetails])

    const mockFetchFeedbackList = async () => {
        const names = [
            'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E',
            'Đặng Thị F', 'Bùi Văn G', 'Vũ Thị H', 'Đỗ Văn I', 'Trịnh Thị J'
        ];

        const comments = [
            'Ứng dụng rất dễ dùng và tiện lợi!',
            'Tôi gặp chút lỗi khi đăng nhập.',
            'Rất thích tính năng nhắc nhở.',
            'Nên có thêm giao diện tối.',
            'Tốc độ phản hồi khá nhanh.',
            'Chưa thấy chức năng chia sẻ.',
            'Hỗ trợ tốt, phản hồi nhanh.',
            'Nội dung rõ ràng, dễ hiểu.',
            'Cảm ơn đội ngũ phát triển!',
            'Giao diện đẹp và thân thiện.'
        ];

        const feedbacks = Array.from({ length: 30 }, (_, i) => {
            const name = names[Math.floor(Math.random() * names.length)];
            const comment = comments[Math.floor(Math.random() * comments.length)];
            const rating = Math.floor(Math.random() * 5) + 1;
            const daysAgo = Math.floor(Math.random() * 30); // cách đây 0–29 ngày
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - daysAgo);

            return {
                id: i + 1,
                userName: name,
                comment,
                rating,
                createdAt: createdAt.toISOString()
            };
        });

        return new Promise(resolve => {
            setTimeout(() => resolve(feedbacks), 500); // giả lập delay 0.5s
        });
    };

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
                maxHeight: '80vh',          
                overflowY: 'auto', 
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 3,

                '@media (max-width: 900px)': {
                    width: '90%',
                    maxHeight: '70vh',
                },
                '@media (max-width: 600px)': {
                    width: '95%',
                    maxHeight: '60vh',
                },

                // Custom scrollbar
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c1c1c1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#a0a0a0',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                },
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

                {/* Address */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Địa chỉ</Typography>
                    <Typography sx={style.valueStyle}>{`${selectedCustomer?.addresses?.[0]?.addressNo}, ${selectedCustomer?.addresses?.[0]?.gG_DispalyName}`}</Typography>
                </Box>

                {/* Service Count */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Số lần sử dụng dịch vụ</Typography>
                    <Typography sx={style.valueStyle}>{selectedCustomer?.serviceCount === 0 ? "Chưa dùng dịch vụ" : `${selectedCustomer?.serviceCount} lần`}</Typography>
                </Box>

                {/* Bookings Count */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography sx={style.labelStyle}>Số đơn đã đặt thành công</Typography>
                    <Typography sx={style.valueStyle}>{selectedCustomer?.bookings.length === 0 ? "Chưa dùng dịch vụ" : `${selectedCustomer?.bookings.length} dịch vụ`}</Typography>
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

                {/* Feedbacks */}
                <Box sx={{ mb: 1.5 }}>
                    <FeedbackList feedbackList={selectedCustomer?.feedbacks} />
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