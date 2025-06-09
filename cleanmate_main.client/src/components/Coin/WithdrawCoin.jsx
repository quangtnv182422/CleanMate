import React, { useState, useContext } from "react";
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
    Avatar,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    List, ListItem, ListItemAvatar,
    ListItemText, IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SimpleReactValidator from "simple-react-validator";

import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const WithdrawCoin = () => {
    const { user } = useAuth();
    console.log(user)
    const userRole = user?.roles?.[0];
    const { banks } = useContext(AuthContext);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openBankDialog, setOpenBankDialog] = useState(false);
    const [searchBank, setSearchBank] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [amount, setAmount] = useState(0);
    const [bankAccountNo, setBankAccountNo] = useState("");
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
                    message: "Số tiền không đạt mức tối thiểu cho phép.",
                    rule: (val) => {
                        const amount = parseFloat(val);
                        if (userRole === 'Cleaner') {
                            return amount >= 500000;
                        } else {
                            return amount >= 200000;
                        }
                    },
                    required: true,
                },
                positive_number: {
                    message: "Số tiền phải là số dương.",
                    rule: (val) => parseFloat(val) > 0,
                },
            },
        })
    );

    const handleSubmit = () => {
        if (validator.allValid()) {
            toast.success(`Bạn đã rút ${amount} qua ngân hàng ${selectedBank.name}`)
        } else {
            validator.showMessages();
        }
    }

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        validator.showMessages();
    };

    const handleSelectBank = (bankCode) => {
        setSelectedBank(bankCode);
        setOpenBankDialog(false);
    };

    return (
        <Box maxWidth={600} mx="auto" mt={4} p={2}>
            {userRole === "Customer" && (
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

                </Box>
            )}

            <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Grid container spacing={2}>
                    {userRole === "Customer" && (
                        <Grid
                            item
                            xs={12}
                            sx={{
                                '.errorMessage': {
                                    color: 'red',
                                }
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                Nhập số tài khoản của bạn
                            </Typography>
                            <TextField
                                fullWidth
                                name="accountNumber"
                                type="text"
                                value={bankAccountNo}
                                onBlur={(e) => setBankAccountNo(e.target.value)}
                                onChange={(e) => setBankAccountNo(e.target.value)}
                                placeholder="VD: 0123456789"
                            />
                            <div className="errorMessage">
                                {validator.message('accountNumber', bankAccountNo, 'required')}
                            </div>
                        </Grid>
                    )}

                    <Grid
                        item
                        xs={12}
                        sx={{
                            '.errorMessage': {
                                color: 'red',
                            }
                        }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Nhập số tiền bạn muốn rút
                        </Typography>
                        <TextField
                            fullWidth
                            name="amount"
                            type="number"
                            value={amount}
                            onBlur={(e) => handleAmountChange(e)}
                            onChange={(e) => handleAmountChange(e)}
                            inputProps={{ min: 100000, step: 100000 }}
                            placeholder={userRole === "Customer" ? "VD: 200000" : "VD: 500000"}
                        />
                        {validator.message("amount", amount, "required|numeric|positive_number|min_amount")}
                    </Grid>


                    {/*Select Bank*/}
                    {userRole === "Customer" && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Chọn ngân hàng
                            </Typography>

                            <Grid container spacing={2}>
                                {/* Card Ngân hàng đã chọn */}
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            p: 2,
                                            flex: 1,
                                            backgroundColor: '#f5f5f5',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            height: '77.01px',
                                        }}
                                    >
                                        {selectedBank ? (
                                            <>
                                                <Typography variant="subtitle1">
                                                    {selectedBank?.shortName}
                                                </Typography>
                                                <Typography variant="body2">
                                                    **** {selectedBank?.bin?.slice(-4) || '----'}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="subtitle1">
                                                    Chưa chọn ngân hàng
                                                </Typography>
                                            </>
                                        )}
                                    </Card>
                                </Grid>

                                {/* Card chọn ngân hàng */}
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            p: 2,
                                            flex: 1,
                                            border: '1px solid #ccc',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '77.01px',
                                        }}
                                        onClick={() => setOpenBankDialog(true)}
                                    >
                                        <AddCircleOutlineIcon sx={{ mr: 1 }} fontSize="medium" />
                                        <Typography>Chọn ngân hàng</Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Tổng và thanh toán */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Số tiền bạn muốn rút
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {Number(amount).toLocaleString("vi-VN")} ₫
                        </Typography>
                    </Box>
                    {userRole === "Customer" ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => handleSubmit}
                        >
                            Rút tiền
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => setOpenConfirmDialog(true)}
                        >
                            Rút tiền
                        </Button>
                    )}
                </Box>
            </Paper>

            {userRole === "Customer" && (
                <Dialog open={openBankDialog} onClose={() => setOpenBankDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Chọn ngân hàng</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            placeholder="Tìm tên ngân hàng"
                            value={searchBank}
                            onChange={(e) => setSearchBank(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {banks
                                .filter((bank) =>
                                    bank.shortName.toLowerCase().includes(searchBank.toLowerCase()) ||
                                    bank.name.toLowerCase().includes(searchBank.toLowerCase())
                                )
                                .map((bank) => (
                                    <ListItem
                                        button
                                        key={bank.bin}
                                        onClick={() => handleSelectBank(bank)}
                                    >
                                        <ListItemAvatar>
                                            <img src={bank.logo} alt={bank.shortName} style={{ width: '100%', height: '20px' }} />
                                        </ListItemAvatar>
                                        <ListItemText primary={bank.shortName} secondary={bank.name} />
                                    </ListItem>
                                ))}
                        </List>
                    </DialogContent>
                </Dialog>
            )}

            {userRole === "Cleaner" && (
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Xác nhận rút tiền</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`Bạn có xác nhận muốn rút ${Number(amount).toLocaleString("vi-VN")}đ qua ngân hàng: ${user?.bankName} về số tài khoản: ${user?.bankNo}`}
                        </DialogContentText>
                        <Box
                            mt={1}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <Button variant="outlined" color="error">Từ chối</Button>
                            <Button variant="contained" color="success">Đồng ý</Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    )
};

export default WithdrawCoin;