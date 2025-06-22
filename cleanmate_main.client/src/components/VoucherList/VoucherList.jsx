import { style } from './style.js';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Pagination,
    Button,
    Modal,
    TextField,
} from '@mui/material';
import voucher_icon from '../../images/voucher-icon.png';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

export const cleaningVouchers = [
    {
        name: "CLEAN10K",
        description: "Giảm 10.000 VND cho đơn dọn dẹp từ 2 giờ trở lên",
        expiredInDays: 7,
        expiryDate: "24/06/2025"
    },
    {
        name: "FREETOOLS",
        description: "Miễn phí mang dụng cụ dọn dẹp chuyên dụng (trị giá 30.000 VND)",
        expiryDate: "27/06/2025"
    },
    {
        name: "FIRSTCLEAN",
        description: "Giảm 50.000 VND cho lần sử dụng dịch vụ đầu tiên",
        expiredInDays: 30,
        expiryDate: "17/07/2025"
    },
    {
        name: "WEEKEND20",
        description: "Giảm 20% cho dịch vụ dọn dẹp vào thứ 7 và Chủ Nhật",
        expiryDate: "27/06/2025"
    },
    {
        name: "ROOM4FREE",
        description: "Dọn 4 phòng, tặng thêm 1 phòng miễn phí",
        expiredInDays: 14,
        expiryDate: "01/07/2025"
    },
    {
        name: "FLASHCLEAN",
        description: "Giảm 15.000 VND cho đơn đặt lịch trong vòng 2 giờ",
        expiredInDays: 3,
        expiryDate: "20/06/2025"
    },
    {
        name: "CLEANFAMILY",
        description: "Giảm 10% cho hộ gia đình đăng ký theo tháng",
        expiryDate: "27/06/2025"
    },
    {
        name: "LOYALCLEAN",
        description: "Tặng 1 phiên dọn dẹp miễn phí sau 10 lần sử dụng dịch vụ",
        expiredInDays: 60,
        expiryDate: "16/08/2025"
    },
    {
        name: "SPRINGCLEAN",
        description: "Giảm 30% cho tổng vệ sinh dịp lễ/tết",
        expiryDate: "27/06/2025"
    },
    {
        name: "NEIGHBOR5",
        description: "Giảm thêm 5% khi đặt chung với hàng xóm trong cùng khu",
        expiredInDays: 10,
        expiryDate: "27/06/2025"
    }
];


const WORKS_PER_PAGE = 6;

const VoucherList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filteredVoucher = cleaningVouchers.filter((voucher) =>
        voucher.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVoucher.length / WORKS_PER_PAGE);
    const displayedVoucher = filteredVoucher.slice(
        (page - 1) * WORKS_PER_PAGE,
        page * WORKS_PER_PAGE
    );


    return (
        <Box sx={style.voucherSection}>
            <Box className="container" sx={style.container}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Tìm voucher"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 200 }}
                    />
                </Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedVoucher.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có ưu đãi nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedVoucher.map((voucher, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 2,
                                        boxShadow: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                            <img src={voucher_icon} alt="voucher_icon" />
                                            <Typography variant="h6" sx={{ color: '#1976D2'}}>{voucher.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {voucher.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, mb: 1 }}>
                                            <HourglassBottomIcon size="small" fontSize="12px" color="warning" />
                                            <Typography variant="caption" sx={{ color: 'green' }}>
                                                {voucher.expiredInDays
                                                ? `Hết hạn sau ${voucher.expiredInDays} ngày`
                                                    : `HSD: ${voucher.expiryDate}`}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Typography variant="body2" sx={{ textAlign: 'end', margin: 1, color: '#ED707D', cursor: 'pointer' }} onClick={() => navigate('/booking-service?service=1') }>Dùng ngay</Typography>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                    color="primary"
                />
            </Box>
        </Box>
    );
}

export default VoucherList;