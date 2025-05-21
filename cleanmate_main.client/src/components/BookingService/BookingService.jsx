import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CalendarToday from '@mui/icons-material/CalendarToday';
import AccessTime from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';


const style = {
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxSizing: 'border-box',

        //làm mất scrollbar
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
            width: '8px',
            background: 'transparent',
        },

        //hiển thị khi hover vào modal
        '&:hover': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            },
        },
    },
    header: {
        width: '100%',
        height: '50px',
        borderBottom: '1px solid #000',
    },
    headerTitle: {
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: '20px',
        color: '#425398'
    },
    subHeaderTitle: {
        fontSize: '16px',
        color: '#425398'
    },
    footer: {
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        px: 2,
        py: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
    },
    durationSelectionButton: {
        whiteSpace: "pre-line",
        height: "70px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
    },
    durationSelectionButtonText: {
        fontSize: '14px',
        color: '#1565C0',
    }
};

const BookingService = ({ open, handleClose }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(1);
    const [selectedTime, setSelectedTime] = useState(30);
    const [selectedDay, setSelectedDay] = useState('');
    const [days, setDays] = useState([]);

    useEffect(() => {
        const today = new Date();
        const dayLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
        const newDays = [];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dayLabel = dayLabels[currentDate.getDay()];
            const dateStr = currentDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

            let subLabel = dateStr;
            if (i === 0) subLabel = 'Hôm Nay';
            else if (i === 1) subLabel = 'Ngày Mai';

            newDays.push({
                label: dayLabel,
                sub: subLabel,
                date: dateStr,
                change: i < 3 ? -6 : 6,
            });
        }
        setDays(newDays);
        setSelectedDay(newDays[0].date);
    }, []);

    const handleDaySelect = (day) => setSelectedDay(day);

    const timeOptions = [
        { label: "2 Giờ\nTối đa 15m² tổng sàn", value: 15 },
        { label: "2 Giờ\nTối đa 20m² tổng sàn", value: 20 },
        { label: "2 Giờ\nTối đa 30m² tổng sàn", value: 30 },
    ];

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ zIndex: 99999 }}
            >
                <Box sx={style.container}>
                    <Box sx={style.header}>
                        <Typography fontWeight="bold" sx={style.headerTitle}>Dọn dẹp theo giờ</Typography>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        {/* Địa điểm làm việc */}
                        <Box mb={2}>
                            <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                                <LocationOnIcon sx={{ mr: 1 }} />
                                Địa điểm làm việc
                            </Typography>
                            <Typography ml={4}>số nhà 30 Bồ Đề, Bồ Đề, Long Biên, Hà Nội</Typography>
                            <Button variant="outlined" sx={{ ml: 4, mt: 1, fontSize: "12px" }}>
                                Thay đổi
                            </Button>
                        </Box>

                        {/* Số lượng nhân viên */}
                        <Box mb={2}>
                            <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                                <GroupIcon sx={{ mr: 1 }} />
                                Số lượng nhân viên
                            </Typography>
                            <Box mt={1} display="flex" gap={1} sx={{ justifyContent: 'center', width: '100%' }}>
                                <Button
                                    sx={{ width: '100%' }}
                                    variant={selectedEmployee === 1 ? "contained" : "outlined"}
                                    onClick={() => setSelectedEmployee(1)}
                                >
                                    1 x Nhân viên
                                </Button>
                                <Button
                                    disabled
                                    sx={{ width: '100%' }}
                                    variant={selectedEmployee === 2 ? "contained" : "outlined"}
                                    onClick={() => setSelectedEmployee(2)}
                                >
                                    2 x Nhân viên
                                </Button>
                            </Box>
                        </Box>

                        {/* Thời gian dọn dẹp */}
                        <Box sx={{ mb: 2 }}>
                            <Typography fontWeight="bold" mb={1} sx={style.subHeaderTitle}>
                                <AccessAlarmOutlinedIcon sx={{ mr: 1 }} />
                                Thời gian dọn dẹp
                            </Typography>
                            <Grid container spacing={1}>
                                {timeOptions.map((opt, index) => (
                                    <Grid item xs={6} sm={4} key={index}>
                                        <Button
                                            fullWidth
                                            variant={selectedTime === opt.value ? "contained" : "outlined"}
                                            onClick={() => setSelectedTime(opt.value)}
                                            sx={{ whiteSpace: "pre-line", height: "70px" }}
                                        >
                                            {opt.label}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Ngày làm việc */}
                        <Box mb={2}>
                            <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                                <CalendarToday sx={{ mr: 1 }} />
                                Ngày làm việc
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mt: 1, width: '100%' }}>
                                {days.map((day) => (
                                    <Button
                                        key={day.date}
                                        variant={selectedDay === day.date ? 'contained' : 'outlined'}
                                        onClick={() => handleDaySelect(day.date)}
                                        sx={{
                                            flex: '1 1 calc(14.28% - 8px)',
                                            minWidth: 72,
                                            p: 1,
                                            flexDirection: 'column',
                                            borderColor: '#4caf50',
                                            color: '#4caf50',
                                            borderWidth: 2,
                                        }}
                                    >
                                        {selectedDay === day.date ? (<Typography sx={{ color: '#fff' }}>{day.label}</Typography>) : (<Typography>{day.label}</Typography>)}
                                        <Typography variant="caption">{day.sub}</Typography>
                                    </Button>
                                ))}
                            </Box>
                        </Box>

                        {/* Giờ làm việc */}
                        <Box mb={2}>
                            <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                                <AccessTime sx={{ mr: 1 }} />
                                Giờ làm việc
                            </Typography>
                            <Box
                                sx={{
                                    mt: 1,
                                    p: 1.5,
                                    border: '1px solid #00bcd4',
                                    borderRadius: 1,
                                    color: '#333',
                                    fontSize: 16,
                                    fontWeight: 500,
                                    width: '100%',
                                }}
                            >
                                <Typography sx={{ textAlign: 'center', fontSize: '16px' }}>8:00 - 10:00</Typography>
                            </Box>
                        </Box>

                        {/* Ghi chú */}
                        <Box mb={2}>
                            <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                                <ChatBubbleIcon sx={{ mr: 1 }} />
                                Ghi chú
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
                                placeholder="Nhập ghi chú để nhân viên có thể dễ dàng phục vụ bạn hơn"
                                variant="outlined"
                                sx={{
                                    mt: 1,

                                    border: '1px solid #00bcd4',
                                    borderRadius: 1,
                                }}
                            />
                        </Box>

                        {/* Mã khuyến mãi */}
                        <Box mb={2}>
                            <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                                <ConfirmationNumberIcon sx={{ mr: 1 }} />
                                Mã khuyến mãi
                            </Typography>
                            <Typography sx={{ color: '#999', mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                Chọn mã khuyến mãi để được giảm giá
                                <ArrowForwardIcon />
                            </Typography>
                        </Box>

                        <Box sx={style.footer}>
                            <Typography fontWeight="bold">169,200 đ / 2h</Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ffc107',
                                    '&:hover': {
                                        backgroundColor: '#42bcc8',
                                        color: '#fff',
                                    },
                                    color: '#425398',
                                    fontWeight: 'bold',
                                }}
                            >
                                Tiếp tục
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>)
}

export default BookingService;