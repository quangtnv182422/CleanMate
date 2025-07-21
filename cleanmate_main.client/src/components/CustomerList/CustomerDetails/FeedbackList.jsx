import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Pagination,
    Stack,
    Rating,
} from '@mui/material';

const ITEMS_PER_PAGE = 3;

const FeedbackList = ({ feedbackList }) => {
    const [page, setPage] = useState(1);
    const [cleanerDetailsMap, setCleanerDetailsMap] = useState({});

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // Pagination logic
    const paginatedData = feedbackList?.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const getCleanerDetailById = useCallback(async (cleanerId) => {
        if (!cleanerId || cleanerDetailsMap[cleanerId]) return;

        try {
            const response = await fetch(`/employeelist/${cleanerId}/detail`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            setCleanerDetailsMap(prev => ({ ...prev, [cleanerId]: data }));
        } catch (error) {
            console.error('Error fetching cleaner detail:', error);
        }
    }, [cleanerDetailsMap]);

    useEffect(() => {
        if (!paginatedData) return;
        paginatedData.forEach(fb => {
            getCleanerDetailById(fb.cleanerId);
        });
    }, [getCleanerDetailById, paginatedData]);

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');        
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();                            

        let hours = date.getHours();     
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHour = String(hours).padStart(2, '0');

        return `${day}/${month}/${year}, ${formattedHour}:${minutes}:${seconds} ${ampm}`;
    }

    return (
        <Stack spacing={2} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" textAlign="center">Danh sách phản hồi</Typography>

            { paginatedData?.length === 0 ? (
                <Typography textAlign="center">Không có phản hồi nào.</Typography>
            ) : (
                paginatedData?.map(feedback => (
                    <Card key={feedback.id} variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {`Nhân viên thực hiện: ${cleanerDetailsMap[feedback.cleanerId]?.fullName || 'Đang tải tên người dọn...'}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {formatDate(feedback.createdAt)}
                            </Typography>
                            <Rating value={feedback.rating} readOnly sx={{mb:1}} />
                            <Typography>{feedback.content}</Typography>
                        </CardContent>
                    </Card>
                ))
            )}

            {feedbackList?.length > ITEMS_PER_PAGE && (
                <Pagination
                    count={Math.ceil(feedbackList?.length / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    sx={{ alignSelf: 'center' }}
                />
            )}
        </Stack>
    );
};

export default FeedbackList;