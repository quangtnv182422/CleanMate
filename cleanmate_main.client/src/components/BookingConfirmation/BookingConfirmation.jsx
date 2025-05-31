import { useParams, useNavigate, useLocation } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { Box, Typography } from '@mui/material';

const primaryColor = '#1565C0';

const styles = {
    wrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        paddingBottom: '100px', // để không che nội dung bởi footer
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
    },
    footer: {
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd',
        padding: '16px',
        zIndex: 100,
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
    },
    header: {
        width: '100%',
        height: '50px',
        borderBottom: '1px solid #000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '20px',
    },
    headerTitle: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '20px',
        color: primaryColor,
        fontWeight: 'bold',
    },
    backIcon: {
        cursor: 'pointer',
        color: primaryColor,
    },
};

const BookingConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        selectedAddress,
        selectedEmployee,
        selectedDuration,
        selectedSpecificArea,
        price,
        selectedDay,
        formatSpecificTime,
        note,
        priceId
    } = location.state || {};

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.content}>
                <Box sx={styles.header}>
                    <WestIcon sx={styles.backIcon} onClick={() => navigate(-1)} />
                    <Typography sx={styles.headerTitle}>Dọn dẹp theo giờ</Typography>
                </Box>

                {/* Thông tin ca làm */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ color: primaryColor }}>
                        <ErrorOutlineOutlinedIcon size="small" />
                        <h6 className="fw-semibold" style={{ color: primaryColor, margin: '0' }}>
                            Thông tin ca làm
                        </h6>
                    </div>
                    <p className="mb-2">{selectedAddress.addressNo}</p>
                    <p className="mb-2 pb-2" style={{ borderBottom: '1px solid #000' }}>{selectedAddress.gG_FormattedAddress}</p>
                    <p className="mb-1">Ngày: {selectedDay}</p>
                    <p className="mb-2 pb-2" style={{ borderBottom: '1px solid #000', fontSize: '16px', color: '#222', opacity: 0.8 }}>Bắt đầu lúc: {formatSpecificTime} / {selectedDuration}h</p>
                    <p className="text-muted">{!note ? "Không có ghi chú" : note}</p>
                </div>

                {/* Thông tin dịch vụ */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ color: primaryColor }}>
                        <AssignmentOutlinedIcon size="small" />
                        <h6 className="fw-semibold" style={{ color: primaryColor, margin: '0' }}>
                            Thông tin dịch vụ
                        </h6>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Phí dịch vụ ({selectedEmployee} nhân viên x {selectedDuration}h x {selectedSpecificArea}m²)</span>
                        <span>{formatPrice(price)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between text-muted">
                        <span>Dụng cụ & chất tẩy rửa cơ bản</span>
                        <span>0đ</span>
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between fw-semibold">
                        <span>Tiền dịch vụ</span>
                        <span>{formatPrice(price)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                        <span>Tổng tiền</span>
                        <span>{formatPrice(price)}</span>
                    </div>
                </div>
            </div>

            {/* Nút xác nhận sticky */}
            <div style={styles.footer}>
                <button
                    className="btn text-white fw-bold w-100"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => navigate(`/order/payment?orderId=${id}`, {
                        state: {
                            selectedAddress,
                            selectedEmployee,
                            selectedDuration,
                            selectedSpecificArea,
                            price,
                            selectedDay,
                            formatSpecificTime,
                            note,
                            priceId
                        }
                    })}
                >
                    Xác nhận dịch vụ
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
