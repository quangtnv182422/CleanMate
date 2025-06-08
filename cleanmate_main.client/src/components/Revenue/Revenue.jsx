import { Box, Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Tháng 1', revenue: 47065000 },
    { name: 'Tháng 2', revenue: 58465000 },
    { name: 'Tháng 3', revenue: 52288000 },
    { name: 'Tháng 4', revenue: 62698000 },
    { name: 'Tháng 5', revenue: 73269000 },
    { name: 'Tháng 6', revenue: 58198000 },
    { name: 'Tháng 7', revenue: 44976000 },
    { name: 'Tháng 8', revenue: 71143000 },
    { name: 'Tháng 9', revenue: 54699000 },
    { name: 'Tháng 10', revenue: 62300000 },
    { name: 'Tháng 11', revenue: 50100000 },
    { name: 'Tháng 12', revenue: 74000000 },
];

const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);
};

const formatKey = {
    revenue: 'Thu nhập'
}

const Revenue = () => {
    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976D2'} }>
                    Doanh thu theo thansg (VND)
                </Typography>
                <Box sx={{ height: 350, fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif', }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 20, left: 60, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={formatVND} domain={[5000000, 80000000]}  tickCount={8} />
                            <Tooltip formatter={(value) => [formatVND(value), "Thu nhập"]} />
                            <Bar dataKey="revenue" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Revenue;
