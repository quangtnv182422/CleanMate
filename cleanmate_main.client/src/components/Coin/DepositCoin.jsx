import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    TextField,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";

import vnpayLogo from "../../images/vnpay-logo.png";
import payosLogo from "../../images/payos-logo.png";
import axios from "axios";
import useAuth from "../../hooks/useAuth"

const paymentMethods = [
    {
        id: "vnpay",
        name: "VNPay",
        logo: vnpayLogo,
    },
    {
        id: "payos",
        name: "PayOS",
        logo: payosLogo,
    },
];



const DepositCoin = () => {
    const { user } = useAuth();
    const [amount, setAmount] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState("vnpay");
    const navigate = useNavigate();

    const [validator] = useState(() =>
        new SimpleReactValidator({
            className: "errorMessage",
            messages: {
                required: "Trường này là bắt buộc.",
                numeric: "Chỉ được nhập số.",
            },
            validators: {
                min_amount: {
                    message: "Bạn phải nạp tối thiểu 200,000 đồng.",
                    rule: (val) => parseFloat(val) >= 20000, /// tạm sửa thành 2k để test PayOS
                    required: true,
                },
                positive_number: {
                    message: "Số tiền phải là số dương.",
                    rule: (val) => parseFloat(val) > 0,
                },
            },
        })
    );

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        validator.showMessages();
    }

   /* const handleTopUp = () => {
        if (validator.allValid()) {
            toast.success('Bạn đã thanh toán thành công')
        } else {
            validator.showMessages();
        }
    };*/

    const handleVnPay = async () => {
        if (validator.allValid()) {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                alert("Số tiền không hợp lệ");
                return;
            }

            try {
                const response = await axios.post(
                    "/payments/deposit-vnpay",
                    {
                        userId: user.id,
                        orderType: 'other',
                        amount: parsedAmount,
                        typeTransaction: "Credit",
                        name: user.fullName + "_" 
                    },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const { url } = response.data;
                if (url) {
                    window.location.href = url;
                } else {
                    alert("Không nhận được URL thanh toán.");
                }
            } catch (error) {
                console.error("Lỗi khi tạo giao dịch:", error);
                const message =
                    error.response?.data?.message || "Đã xảy ra lỗi khi tạo giao dịch.";
                alert(message);
            }
        } else {
            validator.showMessages();
        }
    };

    const handlePayOS = async () => {
        if (validator.allValid()) {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                alert("Số tiền không hợp lệ");
                return;
            }

            try {
                const response = await axios.post(
                    "/payments/deposit-payos",
                    {
                        userId: user.id,
                        amount: parsedAmount,
                        typeTransaction: "Credit"
                    },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const { url } = response.data;
                if (url) {
                    window.location.href = url;
                } else {
                    alert("Không nhận được URL thanh toán.");
                }
            } catch (error) {
                console.error("Lỗi khi tạo giao dịch:", error);
                const message =
                    error.response?.data?.message || "Đã xảy ra lỗi khi tạo giao dịch.";
                alert(message);
            }
        } else {
            validator.showMessages();
        }
    };



    return (
        <Box maxWidth={600} mx="auto" mt={4} p={2}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                position: 'relative',
            }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>

                <Typography variant="h6" sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    margin: '0'
                }}>
                    Nạp tiền vào ví điện tử
                </Typography>

            </Box>
            <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Grid container spacing={2}>
                    {/* Nhập số tiền */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            '.errorMessage': {
                                color: 'red',
                            }
                        }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Nhập số tiền
                        </Typography>
                        <TextField
                            fullWidth
                            name="amount"
                            type="number"
                            value={amount}
                            onBlur={(e) => handleAmountChange(e)}
                            onChange={(e) => handleAmountChange(e)}
                            inputProps={{ min: 100000, step: 100000 }}
                            placeholder="VD: 200000"
                        />
                        {validator.message("amount", amount, "required|numeric|positive_number|min_amount")}
                    </Grid>

                    {/* Phương thức thanh toán */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            Chọn phương thức thanh toán
                        </Typography>
                        <Grid container spacing={2}>
                            {paymentMethods.map((method) => (
                                <Grid item xs={6} key={method.id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderColor:
                                                selectedMethod === method.id ? "primary.main" : "grey.300",
                                            boxShadow:
                                                selectedMethod === method.id ? 3 : "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <CardActionArea onClick={() => setSelectedMethod(method.id)}>
                                            <CardMedia
                                                component="img"
                                                height="40"
                                                image={method.logo}
                                                alt={method.name}
                                                sx={{ objectFit: "contain", mt: 1 }}
                                            />
                                            <CardContent sx={{ textAlign: "center", p: 1 }}>
                                                <Typography variant="body2">{method.name}</Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Tổng và thanh toán */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Số tiền phải thanh toán
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {Number(amount).toLocaleString("vi-VN")} ₫
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => {
                            if (selectedMethod === "vnpay") {
                                handleVnPay();
                            } else if (selectedMethod === "payos") {
                                handlePayOS();
                            }
                        }}
                    >
                        Thanh toán
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default DepositCoin;
