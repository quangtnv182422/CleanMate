using CleanMate_Main.Server.Models.DTO.vnPay;
using CleanMate_Main.Server.Proxy.vnPay;
using CleanMate_Main.Server.Services.Wallet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Payment
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IUserWalletService _walletService;

        public PaymentsController(IVnPayService vnPayService, IUserWalletService walletService)
        {
            _vnPayService = vnPayService;
            _walletService = walletService;
        }

        [HttpPost("create-vnpay")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {
            string description;

            if (model.TypeTransaction == "Credit")
            {
                // nạp ví
                description = $"Credit_{model.UserId}_{model.Amount}";
            }
            else if (model.TypeTransaction == "Booking")
            {
                // thanh toán đặt lịch
                description = $"Booking_{model.BookingId}_{model.Amount}";
            }
            else
            {
                return BadRequest("Loại thanh toán không hợp lệ");
            }

            model.OrderDescription = description;

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Redirect(url);
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
                var purpose = parts[0]; // "Credit" hoặc "Booking"

                switch (purpose)
                {
                    case "Credit":
                        var userId = parts[1];
                        var amount = decimal.Parse(parts[2]);
                        var updated = await _walletService.ExchangeMoneyForCoinsAsync(userId, amount, "vnPay", response.TransactionId);
                        if (!updated)
                            return BadRequest(new { message = "Cập nhật ví thất bại", response });
                        break;

                    /*case "Booking":
                        var bookingId = parts[1];
                        var bookingSuccess = await _bookingService.MarkBookingAsPaidAsync(bookingId, response.TransactionId);
                        if (!bookingSuccess)
                            return BadRequest(new { message = "Cập nhật trạng thái booking thất bại", response });
                        break;*/

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
