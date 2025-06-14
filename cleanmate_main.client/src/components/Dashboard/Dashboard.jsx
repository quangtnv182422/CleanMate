import { Grid, Card, CardContent, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { styles } from "./styles.js";
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MovingIcon from '@mui/icons-material/Moving';

const sampleData = [
    { name: "Tháng 1", bookings: 40 },
    { name: "Tháng 2", bookings: 55 },
    { name: "Tháng 3", bookings: 72 },
    { name: "Tháng 4", bookings: 61 },
    { name: "Tháng 5", bookings: 88 },
    { name: "Tháng 6", bookings: 95 },
    { name: "Tháng 7", bookings: 40 },
    { name: "Tháng 8", bookings: 88 },
    { name: "Tháng 9", bookings: 64 },
    { name: "Tháng 10", bookings: 150 },
    { name: "Tháng 11", bookings: 35 },
    { name: "Tháng 12", bookings: 78 },
];

// Helper function to calculate % change
const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
};

export default function Dashboard() {
    const [totalBookings, setTotalBookings] = useState(411);
    const [totalRevenue, setTotalRevenue] = useState(82000000);
    const [activeCleaners, setActiveCleaners] = useState(24);
    const [activeCustomers, setActiveCustomers] = useState(120);

    // Mock data for previous values
    const previousTotalBookings = 390;
    const previousTotalRevenue = 76000000;
    const previousActiveCleaners = 22;
    const previousActiveCustomers = 130;

    const changes = {
        bookings: calculateChange(totalBookings, previousTotalBookings),
        revenue: calculateChange(totalRevenue, previousTotalRevenue),
        cleaners: calculateChange(activeCleaners, previousActiveCleaners),
        customers: calculateChange(activeCustomers, previousActiveCustomers),
    };

    const renderChange = (value) => (
        <Box sx={styles.movingContainer}>
            {parseFloat(value) >= 0 ? (
                <MovingIcon sx={styles.movingIcon} />
            ) : (
                <MovingIcon sx={{ ...styles.movingIcon, color: 'red', transform: 'rotate(65deg)' }} />
            )}
            <Typography variant="body1" sx={{ ...styles.movingValue, color: parseFloat(value) >= 0 ? 'green' : 'red' }}>
                {Math.abs(value)}%
            </Typography>
        </Box>
    );

    return (
        <div className="p-6 space-y-6">
            <Typography variant="h4" gutterBottom>Dashboard</Typography>

            <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={styles.cardContent}>
                            <Box sx={styles.cardTitleContainer}>
                                <ViewStreamIcon fontSize="small" sx={styles.cardTitleIcon} />
                                <Typography variant="h6" sx={styles.cardTitle}>Tổng số đơn</Typography>
                            </Box>
                            <Box sx={styles.cardValueContainer}>
                                <Typography variant="h5" sx={styles.cardValue}>{totalBookings}</Typography>
                                {renderChange(changes.bookings)}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={styles.cardContent}>
                            <Box sx={styles.cardTitleContainer}>
                                <PaidIcon fontSize="small" sx={styles.cardTitleIcon} />
                                <Typography variant="h6" sx={styles.cardTitle}>Doanh thu (VND)</Typography>
                            </Box>
                            <Box sx={styles.cardValueContainer}>
                                <Typography variant="h5" sx={styles.cardValue}>{totalRevenue.toLocaleString()}</Typography>
                                {renderChange(changes.revenue)}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={styles.cardContent}>
                            <Box sx={styles.cardTitleContainer}>
                                <GroupIcon fontSize="small" sx={styles.cardTitleIcon} />
                                <Typography variant="h6" sx={styles.cardTitle}>Tổng nhân viên</Typography>
                            </Box>
                            <Box sx={styles.cardValueContainer}>
                                <Typography variant="h5" sx={styles.cardValue}>{activeCleaners}</Typography>
                                {renderChange(changes.cleaners)}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={styles.cardContent}>
                            <Box sx={styles.cardTitleContainer}>
                                <GroupIcon fontSize="small" sx={styles.cardTitleIcon} />
                                <Typography variant="h6" sx={styles.cardTitle}>Tổng người dùng</Typography>
                            </Box>
                            <Box sx={styles.cardValueContainer}>
                                <Typography variant="h5" sx={styles.cardValue}>{activeCustomers}</Typography>
                                {renderChange(changes.customers)}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Đơn hàng theo tháng
                            </Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={sampleData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="bookings" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
