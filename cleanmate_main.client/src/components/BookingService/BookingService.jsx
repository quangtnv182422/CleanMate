import { useState, useEffect } from 'react';
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
import WestIcon from '@mui/icons-material/West';
import TextField from '@mui/material/TextField';
import {
    Select,
    MenuItem,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const primaryColor = '#1565C0';
const style = {
    container: {
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        boxSizing: 'border-box',
        p: 2,
    },
    header: {
        width: '100%',
        height: '50px',
        borderBottom: '1px solid #000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '20px',
    },
    headerTitle: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '20px',
        color: primaryColor,
        fontWeight: 'bold',
    },
    backIcon: {
        cursor: 'pointer',
        color: primaryColor,
    },
    subHeaderTitle: {
        fontSize: '16px',
        color: '#425398'
    },
    footer: {
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

const BookingService = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(1);
    const [selectedTime, setSelectedTime] = useState(30);
    const [selectedDay, setSelectedDay] = useState('');
    const [days, setDays] = useState([]);
    const [service, setService] = useState([])
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const serviceId = queryParams.get('service');
    const [selectedTimes, setSelectedTimes] = useState('');

    const handleChange = (event) => {
        setSelectedTimes(event.target.value);
    };

    useEffect(() => {
        const fetchDetailService = async () => {
            try {
                const res = await axios.get(`/cleanservice/serviceId/${Number(serviceId)}`);
                setService(res.data);
            } catch (error) {
                console.error('Error fetching service details:', error);
            }
        };

        if (serviceId) {
            fetchDetailService();
        }
    }, [serviceId]);

    console.log(service)

    useEffect(() => {
        const today = new Date();
        const dayLabels = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
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

    const timeSlots = [
        '8:00 - 10:00',
        '10:00 - 12:00',
        '13:00 - 15:00',
        '15:00 - 17:00',
        '17:00 - 19:00',
    ];

    return (
        <div>
            <Box sx={style.container}>
                <Box sx={style.header}>
                    <WestIcon sx={style.backIcon} onClick={() => navigate(-1)} />
                    <Typography sx={style.headerTitle}>Dọn dẹp theo giờ</Typography>
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
                        <Box>
                            <Select
                                value={selectedTimes}
                                onChange={(e) => setSelectedTimes(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mt: 1,
                                    border: '1px solid #00bcd4',
                                    borderRadius: 1,
                                    color: '#333',
                                    fontSize: 16,
                                    fontWeight: 500,
                                    //'& .MuiSelect-select': {
                                    //    padding: '10px 14px',
                                    //    backgroundColor: '#e0f7fa',
                                    //},
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#00bcd4',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#1565C0',
                                    },
                                }}
                            >
                                <MenuItem value={2}>8:00 - 10:00</MenuItem>
                                <MenuItem value={2}>10:00 - 12:00</MenuItem>
                                <MenuItem value={2}>13:00 - 15:00</MenuItem>
                            </Select>
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
                            onClick={() => navigate(`/booking-confirmation/${serviceId}`)}
                        >
                            Tiếp tục
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default BookingService;