import { useParams } from 'react-router-dom';

const BookingConfirmation = () => {
    const { id } = useParams();

    const primaryColor = '#1565C0';

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h4
                        className="card-title text-center fw-bold mb-4"
                        style={{ color: primaryColor }}
                    >
                        Xác nhận dịch vụ
                    </h4>

                    {/* Thông tin ca làm */}
                    <div className="mb-4">
                        <h6 className="fw-semibold" style={{ color: primaryColor }}>
                            🛈 Thông tin ca làm
                        </h6>
                        <p className="mb-1">số nhà 30 Bồ Đề, Bồ Đề, Long Biên, Hà Nội</p>
                        <p className="mb-1">Ngày mai, N.Mai</p>
                        <p className="mb-1">08:00 - 10:00 / 2h</p>
                        <p className="text-muted">Không có ghi chú</p>
                    </div>

                    {/* Thông tin dịch vụ */}
                    <div className="mb-4">
                        <h6 className="fw-semibold" style={{ color: primaryColor }}>
                            📋 Thông tin dịch vụ
                        </h6>
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

                    {/* Nút xác nhận */}
                    <div className="d-grid">
                        <button
                            className="btn text-white fw-bold"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Xác nhận dịch vụ
                        </button>
                    </div>
                </div>
            </div>

            {/* Optional: Hiển thị ID nếu có */}
            <div className="text-center mt-3 text-muted">
                Booking ID: <strong>{id}</strong>
            </div>
        </div>
    );
};

export default BookingConfirmation;
