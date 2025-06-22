import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Rating,
    Chip,
    Divider,
    TextField,
} from '@mui/material';
import { styles } from './style';
import { toast } from 'react-toastify';
import serviceImage from '../../images/service-single/hourly-cleaning-main-image.jpg';
import axios from 'axios';

const Feedback = ({ selectedOrder, loading, setLoading, onOrderListRefresh, handleClose }) => {
    const [ratingValue, setRatingValue] = useState(null);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [otherReason, setOtherReason] = useState("");
    const navigate = useNavigate();

    const handleReasonSelect = (reason) => {
        setSelectedReasons(prev =>
            prev.includes(reason)
                ? prev.filter(item => item !== reason)
                : [...prev, reason]
        );
    };

    const feedbackLabels = {
        1: "Rất không hài lòng",
        2: "Không hài lòng",
        3: "Bình thường",
        4: "Hài lòng",
        5: "Rất hài lòng"
    }

    const feedbackReason = [
        {
            star: 1,
            reason: [
                "Không tới làm",
                "Thái độ không tốt",
                "Làm không đúng yêu cầu",
                "Không sạch sẽ",
                "Không đúng giờ",
                "Không mặc đồng phục",
            ],
            inputText: true,
        },
        {
            star: 2,
            reason: [
                "Không đúng giờ",
                "Thái độ chưa tốt",
                "Làm chưa kỹ",
                "Không sạch sẽ",
                "Không mặc đồng phục",
            ],
            inputText: true,
        },
        {
            star: 3,
            reason: [
                "Không đúng giờ",
                "Làm chưa kỹ",
                "Chưa thân thiện",
                "Không mặc đồng phục",
            ],
            inputText: true,
        },
        {
            star: 4,
            reason: [
                "Cần cải thiện thái độ",
                "Cần sạch sẽ hơn",
                "Cần đúng giờ hơn",
            ],
            inputText: true,
        },
        {
            star: 5,
            reason: [
                "Rất hài lòng",
                "Làm việc vượt mong đợi",
                "Thái độ chuyên nghiệp",
                "Rất sạch sẽ",
                "Sẽ giới thiệu cho người khác",
            ],
            inputText: false,
        },
    ];

    const postFeedback = async (bookingId, cleanerId, rating, content, selectedReasons, otherReason) => {
        try {
            //navigate('/loading', { replace: true });
            const feedbackData = {
                bookingId: bookingId,
                cleanerId: cleanerId,
                rating: rating,
                content: content || '',
            };

            let feedbackContent = '';
            if (selectedReasons.length > 0) {
                feedbackContent += selectedReasons.join(', ') + '. ';
            }
            if (otherReason) {
                feedbackContent += otherReason;
            }
            feedbackData.content = feedbackContent || 'Không có ghi chú thêm.';

            const response = await axios.post('/feedback', feedbackData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Đảm bảo gửi cookie nếu cần
            });

            if (response.status === 200) {
                toast.success('Gửi đánh giá thành công.');
                //navigate('/order/no-rating-yet', {replace: true})
                //setTimeout(() => {
                //    window.location.reload(); // Hoặc dùng navigate(0) nếu dùng useNavigate()
                //}, 1000);
                return true;
            } else {
                toast.error(response.data.message || 'Gửi đánh giá thất bại.');
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi gửi phản hồi:', error);
            toast.error('Có lỗi xảy ra khi gửi phản hồi.');
            return false;
        }
    };

    const handleSubmitFeedback = async () => {
        //if (loading) return;

        if (!ratingValue || ratingValue <= 0 || ratingValue > 5) {
            toast.warning('Vui lòng chọn số sao trước khi gửi đánh giá.');
            return;
        }

        if (selectedReasons.length === 0 && otherReason.trim() === '') {
            toast.warning('Vui lòng chọn lý do đánh giá hoặc nhập lý do khác.');
            return;
        }

        //setLoading(true);


        const success = await postFeedback(
            selectedOrder.bookingId,
            selectedOrder.cleanerId,
            ratingValue,
            '',
            selectedReasons,
            otherReason
        );

        if (success) {
            handleClose();
            if (onOrderListRefresh) onOrderListRefresh();
        }

        //setLoading(false)
    };


    return (
        <Box sx={styles.modalFeedback}>
            <Box sx={styles.serviceImage}>
                <img
                    src={serviceImage}
                    alt="hình ảnh của dịch vụ"
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                    }} />
            </Box>

            <Typography variant="h5" sx={styles.feedbackTitle}>Đánh giá dịch vụ</Typography>

            <Divider />

            <Box sx={{ textAlign: 'center', mt: 2 }}>
                {ratingValue !== null && (
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 500, color: '#666' }}>
                        {feedbackLabels[ratingValue]}
                    </Typography>
                )}
                <Rating
                    value={ratingValue}
                    onChange={(event, newValue) => {
                        setRatingValue(newValue);
                    }}
                    size="large"
                    sx={{
                        color: '#FBC11B',
                        '& .MuiRating-iconFilled': {
                            color: '#FBC11B',
                        },
                        '& .MuiRating-iconHover': {
                            color: '#FBC11B',
                        },
                    }}
                />
            </Box>

            {ratingValue <= 5 && ratingValue > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ mb: 1, textAlign: 'center' }}>Điều gì bạn chưa hài lòng?</Typography>
                    <Box sx={styles.feedbackReason}>
                        {feedbackReason
                            .find(item => item.star === ratingValue)?.reason
                            .map((reason, idx) => (
                                <Chip
                                    key={idx}
                                    label={reason}
                                    variant={selectedReasons.includes(reason) ? 'filled' : 'outlined'}
                                    color={selectedReasons.includes(reason) ? 'warning' : 'default'}
                                    onClick={() => handleReasonSelect(reason)}
                                />
                            ))
                        }
                    </Box>
                    {(() => {
                        const selectedFeedback = feedbackReason.find(item => item.star === ratingValue);
                        if (selectedFeedback?.inputText) {
                            return (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    sx={{ mt: 2 }}
                                    placeholder="Vui lòng nhập lý do khác..."
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                />
                            );
                        }
                        return null;
                    })()}
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {selectedOrder.status === "pending" && (
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 1, mr: 0 }}
                        onClick={handleClose}
                    >
                        Bỏ qua
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 1, ml: 'auto' }}
                    onClick={handleSubmitFeedback}
                >
                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
            </Box>
        </Box>
    )
}

export default Feedback;