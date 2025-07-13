import { Grid, Card, CardContent, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { styles } from "./styles.js";
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import useAuth from "../../hooks/useAuth.jsx";

export default function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [orderPerMonth, setOrderPerMonth] = useState([]);

    console.log(orderPerMonth);

    useEffect(() => {
        fetch('/dashboard/summary')
            .then((res) => {
                if (!res.ok) throw new Error('Lỗi khi gọi API');
                return res.json();
            })
            .then((data) => {
                setSummary(data);
            })
            .catch((err) => {
                console.log(err)
            });
    }, []);

    useEffect(() => {
        fetch('/dashboard/orders-per-month')
            .then((res) => {
                if (!res.ok) throw new Error('Lỗi khi gọi API');
                return res.json();
            })
            .then((data) => {
                setOrderPerMonth(data);
            })
            .catch((err) => {
                console.log(err)
            });
    }, []);

    const today = new Date();
    const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = days[today.getDay()];

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const fullDate = `${dayOfWeek}, ${day}-${month}-${year}`;

    return (
        <div className="p-6 space-y-6">
            <Typography variant="h4" gutterBottom sx={{ color: '#1976D2' }}>Xin chào, {user?.fullName}</Typography>
            <Typography vairant="body2" sx={{color: '#aaa', marginBottom: '10px'}}>{fullDate}</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={styles.cardContent}>
                            <Box sx={styles.cardTitleContainer}>
                                <ViewStreamIcon fontSize="small" sx={styles.cardTitleIcon} />
                                <Typography variant="h6" sx={styles.cardTitle}>Tổng số đơn</Typography>
                            </Box>
                            <Box sx={styles.cardValueContainer}>
                                <Typography variant="h5" sx={styles.cardValue}>{summary?.totalBookings}</Typography>
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
                                <Typography variant="h5" sx={styles.cardValue}>{summary?.totalRevenue.toLocaleString()}</Typography>
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
                                <Typography variant="h5" sx={styles.cardValue}>{summary?.totalCleaners}</Typography>
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
                                <Typography variant="h5" sx={styles.cardValue}>{summary?.totalUsers}</Typography>
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
                                <BarChart data={orderPerMonth}>
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
