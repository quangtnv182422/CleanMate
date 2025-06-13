import { useState, useEffect, useContext } from 'react'
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
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { style } from './style.js'
import { BookingStatusContext } from '../../context/BookingStatusProvider';
import StarIcon from '@mui/icons-material/Star';
import useAuth from '../../hooks/useAuth.jsx';
import FeedbackDetails from './FeedbackDetails/FeedbackDetails.jsx';

const WORKS_PER_PAGE = 6;

const CleanerViewFeedback = () => {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [work, setWork] = useState([
        {
            bookingId: 1,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "20m² làm trong 2 giờ",
            duration: "2 giờ",
            price: "180.000 VND",
            commission: "99.000 VND",
            date: "15-06-2025",
            startTime: "12 giờ",
            address: "Nhà Ga Chùa Hà",
            addressNo: "lầu 1, nhà 2034",
            note: "",
            isRead: false,
            customerFullName: "Hoàng Tiến",
            customerPhoneNumber: "0903700289",
            employeeId: "1bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJg0Hd5UerNTERKiqEAy-hPAg",
            latitude: "21.0349098",
            longitude: "105.7944445",
            decimalPrice: 180000.0,
            decimalCommission: 99000.0,
            rating: 5,
            feedbackContent: "Dịch vụ rất tốt, nhân viên chuyên nghiệp"
        },
        {
            bookingId: 2,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "25m² làm trong 2 giờ",
            duration: "2 giờ",
            price: "200.000 VND",
            commission: "110.000 VND",
            date: "16-06-2025",
            startTime: "09 giờ",
            address: "Số 10, Nguyễn Trãi",
            addressNo: "tầng 2, phòng 204",
            note: "Nhà có thú cưng",
            isRead: false,
            customerFullName: "Nguyễn Văn A",
            customerPhoneNumber: "0912345678",
            employeeId: "2bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJmQJIxlH9NTER4P5N2V9vzc0",
            latitude: "21.0039098",
            longitude: "105.8023345",
            decimalPrice: 200000.0,
            decimalCommission: 110000.0,
            rating: 4,
            feedbackContent: "Hài lòng nhưng có thể cải thiện tốc độ"
        },
        {
            bookingId: 3,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "30m² làm trong 3 giờ",
            duration: "3 giờ",
            price: "250.000 VND",
            commission: "125.000 VND",
            date: "17-06-2025",
            startTime: "10 giờ",
            address: "Số 23, Trần Duy Hưng",
            addressNo: "tầng 3, nhà 307",
            note: "",
            isRead: false,
            customerFullName: "Trần Thị B",
            customerPhoneNumber: "0923456789",
            employeeId: "3bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJbU60yXxjNTER8z9s2MOsA7g",
            latitude: "21.0167798",
            longitude: "105.8031145",
            decimalPrice: 250000.0,
            decimalCommission: 125000.0,
            rating: 5,
            feedbackContent: "Rất hài lòng, nhân viên nhiệt tình"
        },
        {
            bookingId: 4,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "15m² làm trong 1 giờ",
            duration: "1 giờ",
            price: "150.000 VND",
            commission: "85.000 VND",
            date: "18-06-2025",
            startTime: "08 giờ",
            address: "Số 12, Giải Phóng",
            addressNo: "tầng 1, nhà 105",
            note: "Cần mang dụng cụ riêng",
            isRead: false,
            customerFullName: "Lê Văn C",
            customerPhoneNumber: "0934567890",
            employeeId: "4bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJ3zX1w1BjNTER7TfxRewDmPo",
            latitude: "21.0134198",
            longitude: "105.8277745",
            decimalPrice: 150000.0,
            decimalCommission: 85000.0,
            rating: 3,
            feedbackContent: "Tạm ổn, làm sạch chưa kỹ lắm"
        },
        {
            bookingId: 5,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "18m² làm trong 2 giờ",
            duration: "2 giờ",
            price: "170.000 VND",
            commission: "95.000 VND",
            date: "19-06-2025",
            startTime: "14 giờ",
            address: "Số 45, Láng Hạ",
            addressNo: "tầng 4, phòng 402",
            note: "",
            isRead: false,
            customerFullName: "Phạm Thu D",
            customerPhoneNumber: "0945678901",
            employeeId: "5bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJG7btYlRjNTERb7PB5VRZQ2g",
            latitude: "21.0270098",
            longitude: "105.8097745",
            decimalPrice: 170000.0,
            decimalCommission: 95000.0,
            rating: 5,
            feedbackContent: "Rất chuyên nghiệp và sạch sẽ"
        },
        {
            bookingId: 6,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "22m² làm trong 2 giờ",
            duration: "2 giờ",
            price: "190.000 VND",
            commission: "105.000 VND",
            date: "20-06-2025",
            startTime: "16 giờ",
            address: "Số 98, Hoàng Quốc Việt",
            addressNo: "tầng 5, phòng 509",
            note: "",
            isRead: false,
            customerFullName: "Đặng Văn E",
            customerPhoneNumber: "0956789012",
            employeeId: "6bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJOXeij2VjNTERhGGXwLxG85I",
            latitude: "21.0389998",
            longitude: "105.7964445",
            decimalPrice: 190000.0,
            decimalCommission: 105000.0,
            rating: 4,
            feedbackContent: "Nhân viên lịch sự, làm tốt"
        },
        {
            bookingId: 7,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "26m² làm trong 3 giờ",
            duration: "3 giờ",
            price: "260.000 VND",
            commission: "130.000 VND",
            date: "21-06-2025",
            startTime: "11 giờ",
            address: "Số 7, Tây Sơn",
            addressNo: "tầng 3, nhà 301",
            note: "Cần làm sạch cửa kính",
            isRead: false,
            customerFullName: "Ngô Minh F",
            customerPhoneNumber: "0967890123",
            employeeId: "7bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJ78Yjs1djNTERl1nl5R7Chdc",
            latitude: "21.0259098",
            longitude: "105.8134445",
            decimalPrice: 260000.0,
            decimalCommission: 130000.0,
            rating: 2,
            feedbackContent: "Không hài lòng vì đến trễ"
        },
        {
            bookingId: 8,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "20m² làm trong 2 giờ",
            duration: "2 giờ",
            price: "180.000 VND",
            commission: "100.000 VND",
            date: "22-06-2025",
            startTime: "13 giờ",
            address: "Số 20, Cầu Giấy",
            addressNo: "tầng 6, phòng 602",
            note: "",
            isRead: false,
            customerFullName: "Vũ Thị G",
            customerPhoneNumber: "0978901234",
            employeeId: "8bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJZxk9sFZjNTERByWTTn2xM9g",
            latitude: "21.0300098",
            longitude: "105.7944445",
            decimalPrice: 180000.0,
            decimalCommission: 100000.0,
            rating: 5,
            feedbackContent: "Tuyệt vời, sẽ đặt lại lần sau"
        },
        {
            bookingId: 9,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "24m² làm trong 2 giờ",
            duration: "2 giờ",
            price: "195.000 VND",
            commission: "108.000 VND",
            date: "23-06-2025",
            startTime: "15 giờ",
            address: "Số 8, Kim Mã",
            addressNo: "tầng 2, phòng 206",
            note: "",
            isRead: false,
            customerFullName: "Trịnh Văn H",
            customerPhoneNumber: "0989012345",
            employeeId: "9bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJz2o4W1VjNTER3BTyMWwTgW4",
            latitude: "21.0333098",
            longitude: "105.8033445",
            decimalPrice: 195000.0,
            decimalCommission: 108000.0,
            rating: 3,
            feedbackContent: "Tạm ổn, làm sạch chưa kỹ lắm"
        },
        {
            bookingId: 10,
            serviceName: "Dọn nhà theo giờ",
            serviceDescription: "28m² làm trong 3 giờ",
            duration: "3 giờ",
            price: "270.000 VND",
            commission: "140.000 VND",
            date: "24-06-2025",
            startTime: "17 giờ",
            address: "Số 66, Phạm Hùng",
            addressNo: "tầng 7, phòng 701",
            note: "Ưu tiên nhân viên nữ",
            isRead: false,
            customerFullName: "Đỗ Minh I",
            customerPhoneNumber: "0990123456",
            employeeId: "10bce1e2a-c4fa-4ebf-9a5c-b52861247d6c",
            placeID: "ChIJl2mR61djNTERu6Du2reA9hI",
            latitude: "21.0366098",
            longitude: "105.7956445",
            decimalPrice: 270000.0,
            decimalCommission: 140000.0,
            rating: 4,
            feedbackContent: "Ổn áp, đúng giờ và sạch sẽ"
        }
    ]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(2);
    const [selectedWork, setSelectedWork] = useState(null);

    const handleClose = () => setOpen(false);

    const filteredWork = work.filter((work) => {
        return work.customerFullName.toLowerCase().includes(search.toLowerCase());
    });

    const totalPages = Math.ceil(filteredWork.length / WORKS_PER_PAGE);
    const displayedWork = filteredWork.slice(
        (page - 1) * WORKS_PER_PAGE,
        page * WORKS_PER_PAGE
    );

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1); // Reset to first page when status changes
    };

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        return `${hour}:${minute}`
    }

    const formatDate = (input) => {
        const date = new Date(input);
        if (isNaN(date)) return '';
        return date.toLocaleDateString('vi-VN');
    }

    const handleOpenFeedbackDetails = (work) => {
        setSelectedWork(work);
        setOpen(true);
    }
    return (
        <Box sx={style.feedbackSection}>
            <Box className="container" sx={style.container}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Tìm công việc theo tên"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 200 }}
                    />
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {displayedWork.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'gray' }}>
                                Hiện tại chưa có công việc nào.
                            </Typography>
                        </Grid>
                    ) : (
                        displayedWork.map((work, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={style.workCard} onClick={() => handleOpenFeedbackDetails(work)}>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'gray' }}>
                                            Bắt đầu lúc {work.startTime} ngày {work.date}
                                        </Typography>
                                        <Typography sx={{ mt: 2, fontWeight: 500 }}>{work.customerFullName}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary">{`${work.addressNo} - ${work.address}`}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary">Đánh giá: <span>{work.rating} <StarIcon color="warning" fontSize="small" /></span></Typography>
                                        <Typography variant="subtitle2" color="textSecondary">Phản hồi của khách hàng: <span>{work.feedbackContent}</span></Typography>
                                        <Box sx={style.priceSection}>
                                            <Typography variant="h6" sx={{ color: '#1976D2' }}>
                                                Số tiền: {formatPrice(work.decimalPrice)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>


                {open && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableAutoFocus
                    >
                        <FeedbackDetails selectedWork={selectedWork} />
                    </Modal>
                )}

                {/* Pagination */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default CleanerViewFeedback;