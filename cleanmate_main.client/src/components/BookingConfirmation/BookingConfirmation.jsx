import { useParams, useNavigate } from 'react-router-dom';
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
                    <p className="mb-2" style={{ borderBottom: '1px solid #000' }}>số nhà 30 Bồ Đề, Bồ Đề, Long Biên, Hà Nội</p>
                    <p className="mb-1">Ngày mai, N.Mai</p>
                    <p className="mb-2" style={{ borderBottom: '1px solid #000', fontSize: '16px', color: '#d1d1d1' }}>08:00 - 10:00 / 2h</p>
                    <p className="text-muted">Không có ghi chú</p>
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
                        <span>Phí dịch vụ (2 nhân viên x 2h x 20m²)</span>
                        <span>188,000đ</span>
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
                        <span>188,000đ</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                        <span>Tổng tiền</span>
                        <span>188,000đ</span>
                    </div>
                </div>
            </div>

            {/* Nút xác nhận sticky */}
            <div style={styles.footer}>
                <button
                    className="btn text-white fw-bold w-100"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => navigate(`/order/payment?orderId=${id}`)}
                >
                    Xác nhận dịch vụ
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
