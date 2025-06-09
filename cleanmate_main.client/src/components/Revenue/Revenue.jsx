import { Card, CardContent, Typography, Select, MenuItem, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const MonthlyEarnings = () => {
    const [data, setData] = useState([]);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('vi-VN', { month: 'long' }))
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
                setData(data)
                const defaultData = data.find(item => item.month === selectedMonth);
                setMonthlyEarnings(defaultData?.earnings || 0);
            } catch (err) {
                console.error('Error fetching monthly earnings:', err);
                setError('Không thể tải dữ liệu doanh thu tháng này. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyEarnings();
    }, [selectedMonth]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Card
            elevation={6}
            sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%)',
                borderBottom: '2px solid #00acc1',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 172, 193, 0.2)',
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#00acc1',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                        }}
                    >
                        Thu nhập tháng này
                    </Typography>
                    <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                            color: '#00acc1',
                            borderColor: '#00acc1',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00acc1',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00796b',
                            },
                            '& .MuiSvgIcon-root': {
                                color: '#00acc1',
                            },
                            minWidth: 150,
                        }}
                        IconComponent={ArrowDropDownIcon}
                    >
                        {data.map((item) => (
                            <MenuItem key={item.month} value={item.month} sx={{ color: '#00796b' }}>
                                {item.month}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        color: '#00796b',
                        mb: 1,
                        background: 'linear-gradient(90deg, #00796b, #00acc1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                    }).format(monthlyEarnings)}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#424242', fontStyle: 'italic' }}
                >
                    {selectedMonth} đã kiếm được {new Intl.NumberFormat('vi-VN', {
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