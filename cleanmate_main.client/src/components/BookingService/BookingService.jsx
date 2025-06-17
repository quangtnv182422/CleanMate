import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { BookingContext } from '../../context/BookingProvider';
import { style } from './style';
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
    Modal,
    Card,
    CardContent,
    IconButton,
    Chip,
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
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import dayjs from 'dayjs';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import ReactLoading from 'react-loading';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ViewCleaningTools from './ViewCleaningTools/ViewCleaningTools';
import { cleaningVouchers } from '../../components/VoucherList/VoucherList';


// Kích hoạt plugin
dayjs.extend(utc);
dayjs.extend(timezone);
// Định nghĩa múi giờ của người dùng (Việt Nam, UTC+7)
const userTimeZone = 'Asia/Ho_Chi_Minh';

const BookingService = () => {
    const {
        user,
        authLoading,
        userAddress,
        setUserAddress,
        refetchUserAddress,
        loading
    } = useContext(BookingContext);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (authLoading) return;

        const role = user?.roles?.[0];
        if (role === 'Cleaner') {
            toast.error("Bạn không có quyền truy cập trang này");
            navigate('/public-work');
        }
    }, [user, authLoading, navigate]);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedSpecificArea, setSelectedSpecificArea] = useState('15');
    const [selectedEmployee, setSelectedEmployee] = useState(1);
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [price, setPrice] = useState(160000);
    const [priceId, setServicePriceId] = useState(1);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSpecificTimes, setSelectedSpecificTimes] = useState(null);
    const [note, setNote] = useState('');
    const [days, setDays] = useState([]);
    const [service, setService] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [openViewCleaningTools, setOpenViewCleaningTools] = useState(false);
    const [open, setOpen] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [openVoucherList, setOpenVoucherList] = useState(false);

    console.log(cleaningVouchers)

    const now = dayjs();
    const todayStr = now.format('DD/MM/YYYY');
    const isToday = selectedDay === todayStr;

    const queryParams = new URLSearchParams(location.search);
    const serviceId = queryParams.get('service');

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleChoosePrice = (service) => {
        setSelectedDuration(service.durationTime);
        setSelectedSpecificArea(service.squareMeterSpecific);
        setPrice(service.price);
        setServicePriceId(service.priceId);
    };

    const formatVNDCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    useEffect(() => {
        const defaultAddress = userAddress?.find((addr) => addr.isDefault === true);
        if (defaultAddress) {
            setSelectedAddress(defaultAddress);
        }
    }, [userAddress]);

    const updateDefaultAddress = async (address) => {
        try {
            await fetch('/address/edit-address', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    addressId: address.addressId,
                    userId: user.id,
                    gG_FormattedAddress: address.gG_FormattedAddress,
                    gG_DispalyName: address.gG_DispalyName,
                    gG_PlaceId: address.gG_PlaceId,
                    addressNo: address.addressNo,
                    isInUse: true,
                    isDefault: true,
                    latitude: address.latitude,
                    longitude: address.longitude,
                }),
            });

            const updatedAddresses = userAddress.map((addr) => ({
                ...addr,
                isDefault: addr.addressId === address.addressId ? true : false,
            }));
            setUserAddress(updatedAddresses);

            toast.success('Cập nhật địa chỉ mặc định thành công!');
        } catch (err) {
            toast.error(`Lỗi đặt địa chỉ: ${err}`);
        }
    };

    useEffect(() => {
        if (!serviceId) return;

        fetchDetailService(serviceId);
    }, [serviceId, location]);

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
            const dateStr = currentDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

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

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        setIsAvailable(null); // Reset availability khi thay đổi ngày

        // Chỉ kiểm tra availability nếu đã có giờ được chọn
        if (selectedSpecificTimes) {
            checkAvailability(day, selectedSpecificTimes);
        }
    };

    const getMinTime = () => {
        const baseDate = dayjs(selectedDay, 'DD/MM/YYYY');
        if (isToday) {
            const nextHour = now.add(1, 'hour');
            const roundedUpMinutes = Math.ceil(nextHour.minute() / 15) * 15;
            const adjustedTime = nextHour.minute(roundedUpMinutes).second(0);
            const minTimeToday = baseDate.set('hour', 7).startOf('hour');
            return adjustedTime.isBefore(minTimeToday) ? minTimeToday : adjustedTime;
        }
        return baseDate.set('hour', 7).startOf('hour');
    };

    const minTime = getMinTime();

    const maxTime = dayjs(selectedDay, 'DD/MM/YYYY').set('hour', 23).startOf('hour');

    const roundToNearest15Minutes = (time) => {
        const minutes = time.minute();
        const roundedMinutes = Math.round(minutes / 15) * 15;
        return time.minute(roundedMinutes).second(0);
    };

    const handleTimeChange = (newValue) => {
        if (newValue) {
            const roundedTime = roundToNearest15Minutes(newValue);
            setSelectedSpecificTimes(roundedTime);

            // Chỉ kiểm tra availability nếu đã có ngày được chọn
            if (selectedDay) {
                checkAvailability(selectedDay, roundedTime);
            }
        } else {
            setSelectedSpecificTimes(null);
            setIsAvailable(null);
        }
    };

    const shouldDisableTime = (timeValue, clockType) => {
        if (clockType === 'minutes') {
            const minutes = timeValue;
            return minutes % 15 !== 0;
        }
        return false;
    };

    const checkAvailability = async (day, time) => {
        // Tạo thời gian với múi giờ người dùng
        const selectedDateTime = dayjs.tz(
            day + ' ' + time.format('HH:mm:ss'),
            'DD/MM/YYYY HH:mm:ss',
            userTimeZone
        );
        const endTime = selectedDateTime.add(selectedDuration, 'hour');

        // Chuyển đổi sang UTC để gửi đến backend
        const startTimeStr = selectedDateTime.format('YYYY-MM-DD HH:mm:ss');
        const endTimeStr = endTime.format('YYYY-MM-DD HH:mm:ss');

        try {
            const response = await axios.get(
                `/cleanperhour/cleaner-available?startTime=${startTimeStr}&endTime=${endTimeStr}`
            );

            if (response.data.length > 0) {
                setIsAvailable(true);
                toast.success('Có nhân viên khả dụng trong khung giờ này!');
            } else {
                setIsAvailable(false);
                toast.error('Không có nhân viên khả dụng trong khung giờ này, xin lỗi vì sự bất tiện.');
            }
        } catch (error) {
            console.error('Error checking cleaner availability:', error);
            toast.error('Đã xảy ra lỗi khi kiểm tra availability của cleaner.');
        }
    };

    const handleSubmit = () => {
        if (!selectedAddress || !selectedSpecificTimes) {
            toast.error('Vui lòng chọn địa chỉ và giờ làm việc cụ thể.');
            return;
        }

        if (isAvailable === false) {
            toast.error('Không thể tiếp tục vì không có người dọn khả dụng.');
            return;
        }

        navigate(`/order/booking-confirmation/${serviceId}`, {
            state: {
                selectedAddress,
                selectedEmployee,
                selectedDuration,
                selectedSpecificArea,
                price,
                selectedDay,
                formatSpecificTime: selectedSpecificTimes.format('HH:mm:ss'),
                note,
                priceId,
            },
        });
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        toggleDropdown();
    };

    if (authLoading || loading) {
        return (
            <Box sx={style.spinnerContainer}>
                <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
            </Box>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {loading && (
                <Box sx={style.spinnerContainer}>
                    <ReactLoading type="spinningBubbles" color="#122B82" width={100} height={100} />
                </Box>
            )}
            <Box sx={style.container}>
                <Box sx={style.header}>
                    <WestIcon sx={style.icon} onClick={() => navigate(`/service-single/${serviceId}`)} />
                    <Typography sx={style.headerTitle}>Dọn dẹp theo giờ</Typography>
                    <InfoIcon sx={{ ...style.icon, color: 'red' }} onClick={() => navigate('/service-information?type=cleaning-per-hour')} />
                </Box>
                <Box sx={{ p: 1 }}>
                    {/* Địa điểm làm việc */}
                    <Box mb={2} sx={{ position: 'relative' }}>
                        <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                            <LocationOnIcon sx={{ mr: 1 }} />
                            Địa điểm làm việc
                        </Typography>
                        <Typography ml={4}>
                            {userAddress.length === 0 ? (
                                'Hãy đặt địa chỉ đầu tiên'
                            ) : (
                                <>
                                    <Typography sx={style.googleMapAddress}>{selectedAddress?.gG_DispalyName}</Typography>
                                    <Typography sx={style.addressNo}>{selectedAddress?.addressNo}</Typography>
                                </>
                            )}
                        </Typography>
                        {userAddress.length === 0 ? (
                            <Button
                                variant="outlined"
                                sx={{ ml: 4, mt: 1, fontSize: '12px' }}
                                onClick={() => window.location.href = `/map.html?service=${serviceId}`}
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
                                        fontSize: '12px',
                                    }}
                                    onClick={toggleDropdown}
                                >
                                    Thay đổi
                                </Button>
                                {showDropdown && (
                                    <Box sx={style.chooseAddressContainer}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: '#1565C0',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Chọn địa chỉ
                                            </Typography>
                                            <CloseOutlinedIcon size="small" sx={{ cursor: 'pointer' }} onClick={toggleDropdown} />
                                        </Box>
                                        {userAddress.map((item) => {
                                            const isSelected = selectedAddress?.addressId === item.addressId;
                                            return (
                                                <Box
                                                    key={item.addressId}
                                                    sx={{
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
                                                        },
                                                    }}
                                                    onClick={() => handleSelectAddress(item)}
                                                >
                                                    <Typography sx={style.googleMapAddress}>{item.gG_DispalyName}</Typography>
                                                    <Typography sx={style.specificAddress}>{item.addressNo}</Typography>

                                                    {/* Nút Đặt làm mặc định */}
                                                    {item.isDefault ? (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            disabled
                                                            sx={{ mt: 1, backgroundColor: 'gray' }}
                                                        >
                                                            Địa chỉ mặc định
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ mt: 1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateDefaultAddress(item);
                                                            }}
                                                        >
                                                            Đặt làm mặc định
                                                        </Button>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                        <Box sx={{ mt: 1 }}>
                                            <Button
                                                variant="outlined"
                                                sx={{ width: '100%' }}
                                                onClick={() => window.location.href = `/map.html?service=${serviceId}`}
                                            >
                                                Chọn địa chỉ mới
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}
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
                                variant={selectedEmployee === 1 ? 'contained' : 'outlined'}
                                onClick={() => setSelectedEmployee(1)}
                            >
                                1 x Nhân viên
                            </Button>
                            <Button
                                disabled
                                sx={{ width: '100%' }}
                                variant={selectedEmployee === 2 ? 'contained' : 'outlined'}
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
                                        variant={selectedDuration === opt.durationTime ? 'contained' : 'outlined'}
                                        onClick={() => handleChoosePrice(opt)}
                                        sx={{ whiteSpace: 'pre-line', height: '70px', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <p
                                            style={{
                                                ...style.durationSelectionText,
                                                color: selectedDuration === opt.durationTime ? '#fff' : '#1976D2',
                                            }}
                                        >
                                            {opt.durationTime} giờ
                                        </p>

                                        <p
                                            style={{
                                                ...style.durationSelectionText,
                                                color: selectedDuration === opt.durationTime ? '#fff' : '#1976D2',
                                            }}
                                        >
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
                                    {selectedDay === day.date ? (
                                        <Typography sx={{ color: '#fff' }}>{day.label}</Typography>
                                    ) : (
                                        <Typography>{day.label}</Typography>
                                    )}
                                    {selectedDay === day.date ? (
                                        <Typography variant="caption" sx={{ color: '#fff' }}>
                                            {day.sub}
                                        </Typography>
                                    ) : (
                                        <Typography variant="caption">{day.sub}</Typography>
                                    )}
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
                                        ampm={false}
                                        value={selectedSpecificTimes}
                                        onChange={handleTimeChange}
                                        minutesStep={15}
                                        slotProps={{ textField: { fullWidth: true } }}
                                        minTime={minTime}
                                        maxTime={maxTime}
                                        shouldDisableTime={shouldDisableTime}
                                        open={open}
                                        onOpen={() => setOpen(true)}
                                        onClose={() => setOpen(false)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                onClick: () => setOpen(true),
                                            },
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
                        <Box sx={style.viewCleaningToolsContainer} onClick={() => setOpenViewCleaningTools(true)}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}>
                                {/*Icon*/}
                                <VerifiedIcon size="medium" color="success" />
                                {/*Text*/}
                                <Typography variant="body1">Đã bao gồm bộ dụng cụ dọn dẹp</Typography>
                            </Box>
                            {/*ArrowDown Icon*/}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VisibilityIcon size="small" /></Box>
                        </Box>
                    </Box>

                    {/* Mã khuyến mãi */}
                    <Box mb={2} onClick={() => setOpenVoucherList(true)}>
                        <Typography fontWeight="bold" sx={style.subHeaderTitle}>
                            <ConfirmationNumberIcon sx={{ mr: 1 }} />
                            Mã khuyến mãi
                        </Typography>
                        <Typography
                            sx={{ color: '#999', mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        >
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
                                    backgroundColor: '#1976D2',
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
            {openViewCleaningTools && (
                <Modal
                    open={openViewCleaningTools}
                    onClose={() => setOpenViewCleaningTools(false)}
                    disableAutoFocus
                >
                    <ViewCleaningTools setOpenViewCleaningTools={setOpenViewCleaningTools} />
                </Modal>
            )}

            {openVoucherList && (
                <Modal
                    open={openVoucherList}
                    onClose={() => setOpenVoucherList(false)}
                    disableAutoFocus
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        borderRadius: 2,

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
                    }} >
                        <Typography variant="h6" gutterBottom align="center">
                            Ưu đãi hiện có
                        </Typography>

                        <Grid container spacing={2}>
                            {cleaningVouchers.map((voucher, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            p: 1.5,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box sx={{ flexGrow: 1 }}>
                                            {/* Title & Description */}
                                            <Typography fontWeight="bold" fontSize="15px">
                                                {voucher.name}
                                            </Typography>
                                            <Typography fontSize="13px" color="text.secondary">
                                                {voucher.description}
                                            </Typography>

                                            {/* Expiration */}
                                            <Typography
                                                fontSize="12px"
                                                color="error"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {voucher.expiredInDays
                                                    ? `Hết hạn sau ${voucher.expiredInDays} ngày`
                                                    : `HSD: ${voucher.expiryDate}`}
                                            </Typography>

                                            {/* Tag/Label */}
                                            {voucher.tag && (
                                                <Chip
                                                    label={voucher.tag}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                    color="default"
                                                />
                                            )}
                                        </Box>

                                        {/* Favorite & Button */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                gap: 1,
                                                ml: 2,
                                            }}
                                        >
                                            <IconButton size="small">
                                                <FavoriteBorderIcon fontSize="small" />
                                            </IconButton>
                                            <Button
                                                variant="text"
                                                size="small"
                                                color="primary"
                                                sx={{ p: 1, minWidth: 'auto', fontWeight: 'bold' }}
                                            >
                                                Dùng ngay
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default BookingService;