using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.DTO.vnPay;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Proxy.vnPay;
using CleanMate_Main.Server.Services.Bookings;
using CleanMate_Main.Server.Services.Payments;
using CleanMate_Main.Server.Services.Wallet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Payments
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IUserWalletService _walletService;
        private readonly IBookingService _bookingService;
        private readonly IPaymentService _paymentService;


        public PaymentsController(IVnPayService vnPayService, IUserWalletService walletService, IBookingService bookingService, IPaymentService paymentService)
        {
            _vnPayService = vnPayService;
            _walletService = walletService;
            _bookingService = bookingService;
            _paymentService = paymentService;
        }

        [HttpPost("create-vnpay")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {

            string description;

            if (model.TypeTransaction == "Credit")
            {
                // nạp ví
                description = $"_Credit_{model.UserId}_{model.Amount}_";
            }
            else if (model.TypeTransaction == "Booking")
            {
                // thanh toán đặt lịch
                description = $"_Booking_{model.BookingId}_{model.Amount}_";
            }
            else
            {
                return BadRequest("Loại thanh toán không hợp lệ");
            }

            model.OrderDescription = description;

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { url });
        }


        [HttpPost("booking-create-vnpay")]
        public async Task<IActionResult> CreateBookingAndPaymentVnPay([FromBody] BookingCreateDTO bookingDto)
        {
            if (bookingDto == null || bookingDto.TotalPrice == null || bookingDto.TotalPrice <= 0)
                return BadRequest("Thông tin đặt lịch không hợp lệ.");

            try
            {
                // 1. Tạo booking
                var createdBooking = await _bookingService.AddNewBookingAsync(bookingDto);

                // 2. Tạo payment với status = Unpaid
                var payment = new Payment
                {
                    BookingId = createdBooking.BookingId,
                    Amount = bookingDto.TotalPrice.Value,
                    PaymentMethod = "vnPay",
                    PaymentStatus = "Unpaid",
                    CreatedAt = DateTime.Now
                };

                await _paymentService.AddNewPaymentAsync(payment);

                // 3. Tạo URL thanh toán VNPay
                var paymentModel = new PaymentInformationModel
                {
                    Amount = (double) bookingDto.TotalPrice.Value,
                    BookingId = createdBooking.BookingId,
                    TypeTransaction = "Booking",
                    OrderDescription = $"_Booking_{createdBooking.BookingId}_{bookingDto.TotalPrice}_"
                };

                var url = _vnPayService.CreatePaymentUrl(paymentModel, HttpContext);

                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xử lý đặt lịch và thanh toán: {ex.Message}");
            }
        }



        [HttpGet("callback-vnpay")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (!response.Success || response.VnPayResponseCode != "00")
                return BadRequest(new { message = "Thanh toán thất bại", response });

            try
            {
                var parts = response.OrderDescription.Split('_');
                var purpose = parts[2]; // "Credit" hoặc "Booking"

                switch (purpose)
                {
                    case "Credit":
                        var userId = parts[3];
                        var amount = decimal.Parse(parts[4]);
                        var updated = await _walletService.ExchangeMoneyForCoinsAsync(userId, amount, "vnPay", response.TransactionId);
                        if (!updated)
                            return BadRequest(new { message = "Cập nhật ví thất bại", response });
                        break;

                    case "Booking":
                        var bookingId = parts[1];
                      /*  var bookingSuccess = await _bookingService.MarkBookingAsPaidAsync(bookingId, response.TransactionId);
                        if (!bookingSuccess)
                            return BadRequest(new { message = "Cập nhật trạng thái booking thất bại", response });*/
                        break;

                    default:
                        return BadRequest(new { message = "Mục đích giao dịch không xác định", response });
                }

                return Ok(new { message = "Thanh toán thành công", response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý callback", error = ex.Message });
            }
        }
    }
}
