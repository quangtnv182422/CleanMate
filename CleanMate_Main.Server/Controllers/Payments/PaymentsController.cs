using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.DTO.Payos;
using CleanMate_Main.Server.Models.DTO.vnPay;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Proxy.Payos;
using CleanMate_Main.Server.Proxy.vnPay;
using CleanMate_Main.Server.Services.Bookings;
using CleanMate_Main.Server.Services.Payments;
using CleanMate_Main.Server.Services.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Net.payOS.Types;
using System.Security.Claims;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CleanMate_Main.Server.Controllers.Payments
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IUserWalletService _walletService;
        private readonly IBookingService _bookingService;
        private readonly IPaymentService _paymentService;
        private readonly IConfiguration _configuration;
        private readonly IPayosService _payOsService;
        private readonly UserManager<AspNetUser> _userManager;


        public PaymentsController(IVnPayService vnPayService,
                                  IUserWalletService walletService,
                                  IBookingService bookingService,
                                  IPaymentService paymentService,
                                  IConfiguration configuration,
                                  IPayosService payOsService,
                                  UserManager<AspNetUser> userManager)
        {
            _vnPayService = vnPayService;
            _walletService = walletService;
            _bookingService = bookingService;
            _paymentService = paymentService;
            _configuration = configuration;
            _payOsService = payOsService;
            _userManager = userManager;
        }

        [HttpPost("deposit-vnpay")]
        public IActionResult DepositByVnPay([FromBody] PaymentInformationModel model)
        {

            string description;

            if (model.TypeTransaction == "Credit")
            {
                // nạp ví
                description = $"_Credit_{model.UserId}_{model.Amount}_";
            }
            else
            {
                return BadRequest("Loại thanh toán không hợp lệ");
            }

            model.OrderDescription = description;

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { url });
        }

        [HttpPost("deposit-payos")]
        public async Task<IActionResult> DepositByPayOS([FromBody] PaymentPayOSData model)
        {
            if (model.typeTransaction != "Credit")
            {
                return BadRequest("Loại thanh toán không hợp lệ");
            }

            try
            {
                string description = $"Credit_ {model.amount}";

                // Tạo request cho PayOS
                var paymentLinkRequest = new PaymentData(
                    orderCode: int.Parse(DateTimeOffset.Now.ToString("ffffff")), // mã đơn hàng duy nhất
                    amount: model.amount,
                    description: description,
                    items: [new("Nạp ví CleanMate Coin", 1, model.amount)],
                    returnUrl: _configuration["PayOS:Deposit-PayOSReturnUrl"],
                    cancelUrl: _configuration["PayOS:Deposit-PayOSReturnUrl"]
                );

                var result = await _payOsService.CreatePayOSPaymentUrl(paymentLinkRequest);

                if (result == null || string.IsNullOrEmpty(result.checkoutUrl))
                {
                    return StatusCode(500, "Không thể tạo URL thanh toán PayOS.");
                }

                return Ok(new { url = result.checkoutUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi xử lý thanh toán PayOS: {ex.Message}");
            }
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
                    Amount = (double)bookingDto.TotalPrice.Value,
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
                    //Trường hợp nạp tiền vào ví
                    case "Credit":
                        var userId = parts[3];
                        var amount = decimal.Parse(parts[4]);
                        var updated = await _walletService.ExchangeMoneyForCoinsAsync(userId, amount, "vnPay", response.TransactionId);
                        if (!updated)
                            return BadRequest(new { message = "Cập nhật ví thất bại", response });
                        break;

                    //Trường hợp thanh toán booking bằng vnPay
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

        [HttpGet("callback-deposit-payos")]
        public async Task<IActionResult> DepositPaymentCallbackPayOS()
        {
            // Lấy userMail từ Claims
            var userMail = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(userMail))
                return Unauthorized();

            var user = await _userManager.FindByEmailAsync(userMail);
            if (user == null)
                return Unauthorized();

            var response = _payOsService.ProcessReturnUrl(Request.Query);

            if (response == null || response.Code != "00")
            {
                return BadRequest("Dữ liệu trả về không hợp lệ từ PayOS.");
            }

            if (!long.TryParse(response.OrderCode, out long paymentId))
            {
                return BadRequest("ID thanh toán không hợp lệ.");
            }

            try
            {
                if (response.Status == "PAID")
                {
                    var paymentInfor = _payOsService.GetPaymentLinkInfor(paymentId);
                    var result = paymentInfor?.Result;

                    if (result == null)
                        return BadRequest(new { message = "Không lấy được thông tin từ PayOS." });

                    // Lấy amount và transactionId từ result
                    var amount = (decimal)result.amount;
                    var transactionId = result.id;

                    // Gọi dịch vụ để cộng coin vào ví
                    var updated = await _walletService.ExchangeMoneyForCoinsAsync(user.Id, amount, "PayOS", transactionId);
                    if (!updated)
                        return BadRequest(new { message = "Cập nhật ví thất bại", response });

                    return Ok(new
                    {
                        message = "Thanh toán thành công",
                        amount,
                        transactionId
                    });
                }

                return BadRequest(new { message = "Giao dịch chưa hoàn tất.", response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý callback", error = ex.Message });
            }
        }

    }
}
