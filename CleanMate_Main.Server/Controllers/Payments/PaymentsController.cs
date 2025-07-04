﻿using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.DTO.Payos;
using CleanMate_Main.Server.Models.DTO.vnPay;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
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
        private readonly UserHelper<AspNetUser> _userHelper;


        public PaymentsController(IVnPayService vnPayService,
                                  IUserWalletService walletService,
                                  IBookingService bookingService,
                                  IPaymentService paymentService,
                                  IConfiguration configuration,
                                  IPayosService payOsService,
                                  UserManager<AspNetUser> userManager,
                                  UserHelper<AspNetUser> userHelper)
        {
            _vnPayService = vnPayService;
            _walletService = walletService;
            _bookingService = bookingService;
            _paymentService = paymentService;
            _configuration = configuration;
            _payOsService = payOsService;
            _userManager = userManager;
            _userHelper = userHelper;
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
                    PaymentMethod = PaymentType.vnPay,
                    PaymentStatus = "Unpaid",
                    CreatedAt = DateTimeVN.GetNow()
                };

                var savedPayment = await _paymentService.AddNewPaymentAsync(payment);

                // 3. Tạo URL thanh toán VNPay
                var paymentModel = new PaymentInformationModel
                {
                    OrderType = "other",
                    Amount = (double)bookingDto.TotalPrice.Value,
                    Name = "CleanMate Booking_",
                    OrderDescription = $"_Booking_{createdBooking.BookingId}_{savedPayment.PaymentId}_"
                };

                var url = _vnPayService.CreatePaymentUrl(paymentModel, HttpContext);

                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xử lý đặt lịch và thanh toán: {ex.Message}");
            }
        }


        [HttpPost("booking-create-payos")]
        public async Task<IActionResult> CreateBookingAndPaymentPayOS([FromBody] BookingCreateDTO bookingDto)
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
                    PaymentMethod = PaymentType.PayOS,
                    PaymentStatus = "Unpaid",
                    CreatedAt = DateTimeVN.GetNow()
                };

                var savedPayment = await _paymentService.AddNewPaymentAsync(payment);

                // 3. Tạo URL thanh toán PayOS
                string description = $"Booking {createdBooking.BookingId} {savedPayment.PaymentId}";

                var paymentLinkRequest = new PaymentData(
                    orderCode: int.Parse(DateTimeOffset.Now.ToString("ffffff")), // mã đơn hàng duy nhất
                    amount: (int)bookingDto.TotalPrice.Value, // PayOS yêu cầu amount là int
                    description: description,
                    items: [new("Thanh toán dịch vụ CleanMate", 1, (int)bookingDto.TotalPrice.Value)],
                    returnUrl: _configuration["PayOS:Booking-PayOSReturnUrl"],
                    cancelUrl: _configuration["PayOS:Booking-PayOSReturnUrl"]
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
                return StatusCode(500, $"Lỗi khi xử lý đặt lịch và thanh toán: {ex.Message}");
            }
        }


        [HttpPost("booking-create-cmcoin")]
        public async Task<IActionResult> CreateBookingAndPaymentByCoin([FromBody] BookingCreateDTO bookingDto)
        {
            if (bookingDto == null || bookingDto.TotalPrice == null || bookingDto.TotalPrice <= 0)
                return BadRequest("Thông tin đặt lịch không hợp lệ.");

            // Lấy userId từ Claims
            var user = await _userHelper.GetCurrentUserAsync();

            if (user == null)
                return Unauthorized(new { message = "Không tìm thấy người dùng." });

            var wallet = await _walletService.GetWalletAsync(user.Id);
            if (wallet == null)
                return NotFound(new { message = "Không tìm thấy ví cho người dùng này." });

            if (wallet.Balance < bookingDto.TotalPrice)
                return BadRequest(new { message = "Số dư ví không đủ để thực hiện." });

            try
            {
                // 1. Tạo booking
                var createdBooking = await _bookingService.AddNewBookingAsync(bookingDto);

                // 2. Tạo payment với status = Paid
                var payment = new Payment
                {
                    BookingId = createdBooking.BookingId,
                    Amount = bookingDto.TotalPrice.Value,
                    PaymentMethod = PaymentType.CleanMate_Coin,
                    PaymentStatus = "Paid",
                    CreatedAt = DateTimeVN.GetNow()
                };

                var savedPayment = await _paymentService.AddNewPaymentAsync(payment);

                // 3. Trừ tiền từ ví
                var reason = $"Thanh toán booking {createdBooking.BookingId} bằng CM-Coin";
                var deducted = await _walletService.DeductMoneyAsync(user.Id, bookingDto.TotalPrice.Value, reason, createdBooking.BookingId);
                if (!deducted)
                {
                    // Nếu trừ tiền thất bại, xóa payment và booking
                    /*await _paymentService.DeletePaymentAsync(savedPayment.PaymentId);
                    await _bookingService.DeleteBookingAsync(createdBooking.BookingId);*/
                    return StatusCode(500, new { message = "Không thể trừ tiền từ ví." });
                }

                // 4. Lấy chi tiết booking
                var booking = await _bookingService.GetBookingByIdAsync(createdBooking.BookingId);
                if (booking == null)
                {
                    return StatusCode(500, new { message = "Không thể lấy thông tin booking." });
                }

                // 5. Chuẩn bị dữ liệu để gửi về frontend
                var bookingDetails = new
                {
                    success = true,
                    date = booking.Date.ToString("dd/MM/yyyy"),
                    time = $"{booking.StartTime:hh:mm tt} - {booking.StartTime.AddHours(booking.ServicePrice?.Duration?.DurationTime ?? 2):hh:mm tt}",
                    service = booking.ServicePrice?.Service?.Name ?? "Dịch vụ vệ sinh",
                    cleaner = booking.Cleaner?.FullName ?? "Chưa phân công",
                    payment = bookingDto.TotalPrice.Value.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND"
                };

                return Ok(bookingDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xử lý đặt lịch và thanh toán: {ex.Message}" });
            }
        }

        [HttpPost("booking-create-cash")]
        public async Task<IActionResult> CreateBookingAndPaymentByCash([FromBody] BookingCreateDTO bookingDto)
        {
            if (bookingDto == null || bookingDto.TotalPrice == null || bookingDto.TotalPrice <= 0)
                return BadRequest("Thông tin đặt lịch không hợp lệ.");

            // Lấy userId từ Claims
            var user = await _userHelper.GetCurrentUserAsync();

            if (user == null)
                return Unauthorized(new { message = "Không tìm thấy người dùng." });

            try
            {
                // 1. Tạo booking
                var createdBooking = await _bookingService.AddNewBookingAsync(bookingDto);

                // 2. Tạo payment với status = Paid
                var payment = new Payment
                {
                    BookingId = createdBooking.BookingId,
                    Amount = bookingDto.TotalPrice.Value,
                    PaymentMethod = PaymentType.Cash,
                    PaymentStatus = "Unpaid",
                    CreatedAt = DateTimeVN.GetNow()
                };

                var savedPayment = await _paymentService.AddNewPaymentAsync(payment);

                // 4. Lấy chi tiết booking
                var booking = await _bookingService.GetBookingByIdAsync(createdBooking.BookingId);
                if (booking == null)
                {
                    return StatusCode(500, new { message = "Không thể lấy thông tin booking." });
                }

                // 5. Chuẩn bị dữ liệu để gửi về frontend
                var bookingDetails = new
                {
                    success = true,
                    date = booking.Date.ToString("dd/MM/yyyy"),
                    time = $"{booking.StartTime:hh:mm tt} - {booking.StartTime.AddHours(booking.ServicePrice?.Duration?.DurationTime ?? 2):hh:mm tt}",
                    service = booking.ServicePrice?.Service?.Name ?? "Dịch vụ vệ sinh",
                    cleaner = booking.Cleaner?.FullName ?? "Chưa phân công",
                    payment = bookingDto.TotalPrice.Value.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND"
                };

                return Ok(bookingDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xử lý đặt lịch và thanh toán: {ex.Message}" });
            }
        }


        [HttpGet("callback-vnpay")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (!response.Success || response.VnPayResponseCode != "00")
                return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");

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
                        // Redirect to deposit success page
                        var depositQueryString = $"deposit=success&date={Uri.EscapeDataString(DateTimeVN.GetNow().ToString("dd/MM/yyyy"))}&coin={Uri.EscapeDataString(amount.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND")}";
                        return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-success?{depositQueryString}");

                    //Trường hợp thanh toán booking bằng vnPay
                    case "Booking":
                        var paymentId = int.Parse(parts[4]);
                        var bookingSuccess = await _paymentService.MarkBookingAsPaidAsync(paymentId, response.TransactionId);
                        if (bookingSuccess == null)
                            return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail");

                        // Lấy chi tiết booking từ BookingService
                        var booking = await _bookingService.GetBookingByIdAsync(bookingSuccess.BookingId);
                        if (booking == null)
                            return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail");

                        // Chuẩn bị dữ liệu để gửi về frontend
                        var bookingDetails = new
                        {
                            Date = booking.Date.ToString("dd/MM/yyyy"),
                            Time = $"{booking.StartTime:hh:mm tt} - {booking.StartTime.AddHours(booking.ServicePrice?.Duration?.DurationTime ?? 2):hh:mm tt}",
                            Service = booking.ServicePrice?.Service?.Name ?? "Dịch vụ vệ sinh",
                            Cleaner = booking.Cleaner?.FullName ?? "Chưa phân công",
                            Payment = bookingSuccess.Amount.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND"
                        };

                        // Redirect tới trang BookingSuccess với query parameters
                        var queryString = $"success=true&date={Uri.EscapeDataString(bookingDetails.Date)}" +
                                         $"&time={Uri.EscapeDataString(bookingDetails.Time)}" +
                                         $"&service={Uri.EscapeDataString(bookingDetails.Service)}" +
                                         $"&cleaner={Uri.EscapeDataString(bookingDetails.Cleaner)}" +
                                         $"&payment={Uri.EscapeDataString(bookingDetails.Payment)}";
                        var redirectUrl = $"{_configuration["SettingDomain:BaseUrl"]}/booking-success?{queryString}";
                        return Redirect(redirectUrl);

                    default:
                        return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail");
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
            var user = await _userHelper.GetCurrentUserAsync();

            if (user == null)
                return Unauthorized(new { message = "Không tìm thấy người dùng." });

            // Lấy response
            var response = _payOsService.ProcessReturnUrl(Request.Query);
            if (response == null || response.Code != "00")
                return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");

            if (!long.TryParse(response.OrderCode, out long paymentId))
                return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");

            try
            {
                if (response.Status == "PAID")
                {
                    var paymentInfor = _payOsService.GetPaymentLinkInfor(paymentId);
                    var result = paymentInfor?.Result;

                    if (result == null)
                        return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");

                    // Lấy amount và transactionId từ result
                    var amount = (decimal)result.amount;
                    var transactionId = result.id;

                    // Cộng coin vào ví
                    var updated = await _walletService.ExchangeMoneyForCoinsAsync(user.Id, amount, "PayOS", transactionId);
                    if (!updated)
                        return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");

                    // Chuẩn bị dữ liệu để gửi về frontend
                    var depositDetails = new
                    {
                        Date = DateTimeVN.GetNow().ToString("dd/MM/yyyy"),
                        Coin = amount.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND"
                    };

                    // Redirect tới trang BookingSuccess với query parameters
                    var queryString = $"deposit=success&date={Uri.EscapeDataString(depositDetails.Date)}" +
                                     $"&coin={Uri.EscapeDataString(depositDetails.Coin)}";
                    var redirectUrl = $"{_configuration["SettingDomain:BaseUrl"]}/booking-success?{queryString}";

                    return Redirect(redirectUrl);
                }

                return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");
            }
            catch (Exception ex)
            {
                return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail?deposit=fail");
            }
        }


        [HttpGet("callback-booking-payos")]
        public async Task<IActionResult> BookingPaymentCallbackPayOS()
        {
            // Lấy userMail từ Claims
            var userMail = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(userMail))
                return Unauthorized("Không tìm thấy thông tin người dùng.");

            var user = await _userManager.FindByEmailAsync(userMail);
            if (user == null)
                return Unauthorized("Người dùng không tồn tại.");

            // Lấy response từ PayOS
            var response = _payOsService.ProcessReturnUrl(Request.Query);
            if (response == null || response.Code != "00")
                return BadRequest("Dữ liệu trả về không hợp lệ từ PayOS.");

            if (!long.TryParse(response.OrderCode, out long paymentId))
                return BadRequest("ID thanh toán không hợp lệ.");

            try
            {
                if (response.Status == "PAID")
                {
                    var paymentInfor = _payOsService.GetPaymentLinkInfor(paymentId);
                    var result = paymentInfor?.Result;

                    if (result == null)
                        return BadRequest("Không lấy được thông tin thanh toán từ PayOS.");

                    // Lấy amount, transactionId và description
                    var amount = (decimal)result.amount;
                    var transactionId = result.id;
                    var description = result.transactions?.FirstOrDefault()?.description;

                    // Phân tích description để lấy BookingId và PaymentId
                    var parts = description.Split(' ');
                    if (parts[5] != "Booking")
                        return BadRequest("Description không hợp lệ.");

                    if (!int.TryParse(parts[7], out int paymentIdFromDesc))
                        return BadRequest("PaymentId trong description không hợp lệ.");

                    // Cập nhật trạng thái thanh toán
                    var bookingSuccess = await _paymentService.MarkBookingAsPaidAsync(paymentIdFromDesc, transactionId);
                    if (bookingSuccess == null)
                        return BadRequest("Cập nhật trạng thái booking thất bại.");

                    // Lấy chi tiết booking từ BookingService
                    var booking = await _bookingService.GetBookingByIdAsync(bookingSuccess.BookingId);
                    if (booking == null)
                        return BadRequest("Không tìm thấy thông tin booking.");

                    // Chuẩn bị dữ liệu để gửi về frontend
                    var bookingDetails = new
                    {
                        Date = booking.Date.ToString("dd/MM/yyyy"),
                        Time = $"{booking.StartTime:hh:mm tt} - {booking.StartTime.AddHours(booking.ServicePrice.Duration.DurationTime):hh:mm tt}",
                        Service = booking.ServicePrice?.Service.Name ?? "Dịch vụ vệ sinh",
                        Cleaner = booking.Cleaner?.FullName ?? "Chưa phân công",
                        Payment = amount.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND"
                    };

                    /*return Ok(new
                    {
                        message = "Thanh toán thành công",
                        amount,
                        transactionId,
                        paymentId = paymentIdFromDesc
                    });*/
                    // Redirect tới trang BookingSuccess với query parameters

                    var queryString = $"success=true&date={Uri.EscapeDataString(bookingDetails.Date)}" +
                                     $"&time={Uri.EscapeDataString(bookingDetails.Time)}" +
                                     $"&service={Uri.EscapeDataString(bookingDetails.Service)}" +
                                     $"&cleaner={Uri.EscapeDataString(bookingDetails.Cleaner)}" +
                                     $"&payment={Uri.EscapeDataString(bookingDetails.Payment)}";
                    var redirectUrl = $"{_configuration["SettingDomain:BaseUrl"]}/booking-success?{queryString}";

                    return Redirect(redirectUrl);
                }

                return Redirect($"{_configuration["SettingDomain:BaseUrl"]}/booking-fail");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý callback", error = ex.Message });
            }
        }

    }
}
