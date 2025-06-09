import { Box, Card, CardContent, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const MonthlyEarnings = () => {
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonthlyEarnings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/earning', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMonthlyEarnings(data.MonthlyEarnings || 0); // Extract the earnings value
                console.log('Monthly earnings data:', data); // Debug the response
            } catch (err) {
                console.error('Error fetching monthly earnings:', err);
                setError('Không thể tải dữ liệu doanh thu tháng này. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyEarnings();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976D2' }}>
                    Thu nhập tháng này
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Tháng này đã kiếm được: {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                    }).format(monthlyEarnings)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MonthlyEarnings;