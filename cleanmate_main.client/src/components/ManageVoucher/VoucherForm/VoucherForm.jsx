import { useState, useEffect } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import useAuth from '../../../hooks/useAuth';

const VoucherForm = ({ open, onClose, onSubmit, initialData }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        voucherCode: '',
        description: '',
        discountPercentage: 0,
        expireDate: '',
        isEventVoucher: false,
        createdBy: '',
        status: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                voucherCode: '',
                description: '',
                discountPercentage: 0,
                expireDate: '',
                isEventVoucher: false,
                createdBy: '',
                status: 0,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{initialData ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới'}</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="normal" name="voucherCode" label="Mã voucher" value={formData.voucherCode} onChange={handleChange} />
                <TextField fullWidth margin="normal" name="description" label="Mô tả" value={formData.description} onChange={handleChange} />
                <TextField fullWidth margin="normal" name="discountPercentage" label="Giảm giá (%)" type="number" value={formData.discountPercentage} onChange={handleChange} />
                <TextField fullWidth margin="normal" name="expireDate" label="Ngày hết hạn" type="date" InputLabelProps={{ shrink: true }} value={formData.expireDate} onChange={handleChange} />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="event-label">Voucher sự kiện</InputLabel>
                    <Select
                        labelId="event-label"
                        label="Voucher sự kiện"
                        name="isEventVoucher"
                        value={formData.isEventVoucher}
                        onChange={(e) => setFormData(prev => ({ ...prev, isEventVoucher: e.target.value === 'true' }))}
                    >
                        <MenuItem value="false">Không</MenuItem>
                        <MenuItem value="true">Có</MenuItem>
                    </Select>
                </FormControl>
                {initialData && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Trạng thái</InputLabel>
                        <Select
                            labelId="status-label"
                            name="status"
                            label="Trạng thái"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                status: parseInt(e.target.value, 10)
                            }))}
                        >
                            <MenuItem value={0}>Hoạt động</MenuItem>
                            <MenuItem value={1}>Hết hạn</MenuItem>
                            <MenuItem value={2}>Đã khóa</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">{initialData ? 'Cập nhật' : 'Tạo'}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default VoucherForm;