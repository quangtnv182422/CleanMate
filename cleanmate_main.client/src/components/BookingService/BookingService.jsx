import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { BookingContext } from '../../context/BookingProvider';
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CalendarToday from '@mui/icons-material/CalendarToday';
import AccessTime from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WestIcon from '@mui/icons-material/West';
import dayjs from 'dayjs';
import axios from 'axios';

const primaryColor = '#1565C0';
const style = {
    container: {
        width: '100%',
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
        color: '#1565C0'
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
    durationSelectionText: {
        margin: '0',
        fontSize: '14px',
    },
    durationSelectionButtonText: {
        fontSize: '14px',
        color: '#1565C0',
    },
    chooseAddressContainer: {
        position: 'absolute',
        top: '55px',
        left: '140px',
        width: '350px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: 1.2,
        zIndex: '1000',

        '@media (max-width: 600px)': {
            left: 0,
            right: 0,
            width: '90%',
            margin: '0 auto',
            top: '60px',
        },
    },
    googleMapAddress: {
        fontSize: '16px',
        color: '#000',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    specificAddress: {
        color: '#666',
    }
};

const BookingService = () => {
    const {
        userAddress
    } = useContext(BookingContext);
    const navigate = useNavigate();
    const location = useLocation();


    // start of data to store booking information
    const [selectedAddress, setSelectedAddress] = useState(() => {
        const saved = localStorage.getItem('selectedAddress');
        return saved ? JSON.parse(saved) : null;
    });
    const [selectedSpecificArea, setSelectedSpecificArea] = useState('15');
    const [selectedEmployee, setSelectedEmployee] = useState(1);
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [price, setPrice] = useState(160000);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSpecificTimes, setSelectedSpecificTimes] = useState(null); // format time HH:mm A
    const [note, setNote] = useState('');
    // end of data to store booking information

    const [days, setDays] = useState([]);
    const [service, setService] = useState([]); //store information of service details
    const [showDropdown, setShowDropdown] = useState(false);
    const [open, setOpen] = useState(false);

    const now = dayjs();
    const todayStr = now.format('DD/MM/YYYY');
    const isToday = selectedDay === todayStr;

    const queryParams = new URLSearchParams(location.search);
    const serviceId = queryParams.get('service');

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleChoosePrice = (service) => {
        setSelectedDuration(service.durationTime);
        setSelectedSpecificArea(service.squareMeterSpecific)
        setPrice(service.price);
    }

    const formatVNDCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    }

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        localStorage.setItem('selectedAddress', JSON.stringify(address));
        toggleDropdown();
    }

    useEffect(() => {
        if (!serviceId) return;

        fetchDetailService(serviceId)
    }, [serviceId]);

    const fetchDetailService = async (serviceId) => {
        try {
            const res = await axios.get(`/cleanservice/serviceId/${Number(serviceId)}`);
            setService(res.data);
        } catch (error) {
            console.error('Error fetching service details:', error);
        }
    };

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
    const minTime = isToday ? now : dayjs(selectedDay, 'DD/MM/YYYY').startOf('day');

    const roundToNearest15Minutes = (time) => {
        const minutes = time.minute();
        const roundedMinutes = Math.round(minutes / 15) * 15;
        return time.minute(roundedMinutes).second(0);
    };

    const handleTimeChange = (newValue) => {
        if (newValue) {
            const roundedTime = roundToNearest15Minutes(newValue);
            setSelectedSpecificTimes(roundedTime);
        } else {
            setSelectedSpecificTimes(null);
        }
    };

    const shouldDisableTime = (timeValue, clockType) => {
        if (clockType === 'minutes') {
            const minutes = timeValue;
            return minutes % 15 !== 0; // Disable if minutes are not 0, 15, 30, 45
        }
        return false;
    };

    const formatSpecificTime = selectedSpecificTimes?.format("HH:mm A");

    const handleSubmit = () => {
        if (!selectedAddress || !selectedSpecificTimes) {
            toast.error("Vui lòng chọn địa chỉ và giờ làm việc cụ thể.");
            return;
        } else {
            navigate(`/order/booking-confirmation/${serviceId}`, {
                state: {
                    selectedAddress,
                    selectedEmployee,
                    selectedDuration,
                    selectedSpecificArea,
                    price,
                    selectedDay,
                    formatSpecificTime,
                    note
                }
            })
        }
    }

    return (
        <div>
            <Box sx={style.container}>
                <Box sx={style.header}>
                    <WestIcon sx={style.backIcon} onClick={() => navigate(-1)} />
                    <Typography sx={style.headerTitle}>Dọn dẹp theo giờ</Typography>
                </Box>
                <Box sx={{ p: 1 }}>
                    {/* Địa điểm làm việc */}
                    <Box mb={2} sx={{ position: 'relative' }}>
                        <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                            <LocationOnIcon sx={{ mr: 1 }} />
                            Địa điểm làm việc
                        </Typography>
                        <Typography ml={4}>{userAddress.length === 0 ? "Hãy đặt địa chỉ đầu tiên" : selectedAddress?.addressNo}</Typography>
                        {userAddress.length === 0 ? (
                            <Button
                                variant="outlined" sx={{ ml: 4, mt: 1, fontSize: "12px" }}
                                onClick={() => navigate(`/booking-service/choose-address?service=${serviceId}`)}

                            >
                                Thêm địa chỉ mới
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        ml: 4,
                                        mt: 1,
                                        fontSize: "12px",
                                    }}
                                    onClick={toggleDropdown}
                                >
                                    Thay đổi
                                </Button>
                                {showDropdown && (
                                    <Box sx={style.chooseAddressContainer}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{
                                                color: '#1565C0',
                                                fontWeight: 'bold',
                                            }}>Chọn địa chỉ</Typography>
                                            <CloseOutlinedIcon size="small" sx={{ cursor: 'pointer' }} onClick={toggleDropdown} />
                                        </Box>
                                        {userAddress.slice().reverse().map((item) => {
                                            const isSelected = selectedAddress?.addressId === item.addressId;

                                            return (
                                                <Box key={item.addressId} sx={{
                                                    mt: 1,
                                                    px: 0.5,
                                                    py: 1,
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    backgroundColor: isSelected ? '#f1f1f1' : 'transparent',
                                                    color: isSelected ? '#fff' : 'inherit',
                                                    '&:hover': {
                                                        backgroundColor: isSelected ? '#f1f1f1' : '#f0f0f0',
                                                        color: '#1565C0',
                                                    }
                                                }} onClick={() => handleSelectAddress(item)}
                                                >
                                                    <Typography sx={style.googleMapAddress}>{item.gG_FormattedAddress}</Typography>
                                                    <Typography sx={style.specificAddress}>{item.addressNo}</Typography>
                                                </Box>
                                            )
                                        })}
                                        <Box sx={{ mt: 4 }}>
                                            <Button
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                                onClick={() => navigate(`/booking-service/choose-address?serviceId=${serviceId}`)}
                                            >
                                                Chọn địa chỉ mới
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )
                        }
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
                            {service.map((opt, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <Button
                                        fullWidth
                                        variant={selectedDuration === opt.durationTime ? "contained" : "outlined"}
                                        onClick={() => handleChoosePrice(opt)}
                                        sx={{ whiteSpace: "pre-line", height: "70px", display: 'flex', flexDirection: 'column' }}
                                    >
                                        <p style={{
                                            ...style.durationSelectionText,
                                            color: selectedDuration === opt.durationTime ? '#fff' : '#1976D2'
                                        }}>
                                            {opt.durationTime} giờ
                                        </p>

                                        <p style={{
                                            ...style.durationSelectionText,
                                            color: selectedDuration === opt.durationTime ? '#fff' : '#1976D2'
                                        }}>
                                            Tối đa {opt.squareMeterSpecific}m² tổng sàn
                                        </p>
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                        label="Hãy chọn giờ cụ thể"
                                        value={selectedSpecificTimes}
                                        onChange={handleTimeChange}
                                        minutesStep={15}
                                        slotProps={{ textField: { fullWidth: true } }}
                                        minTime={minTime}
                                        shouldDisableTime={shouldDisableTime}
                                        open={open}
                                        onOpen={() => setOpen(true)}
                                        onClose={() => setOpen(false)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                onClick: () => setOpen(true), // ⬅ mở popup khi click vào input
                                            }
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
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
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
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
                        <Typography fontWeight="bold">{`${formatVNDCurrency(price)} / ${selectedDuration}h`}</Typography>
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
                            onClick={handleSubmit}
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