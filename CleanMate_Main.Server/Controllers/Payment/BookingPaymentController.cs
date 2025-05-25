using CleanMate_Main.Server.Models.DTO.vnPay;
using CleanMate_Main.Server.Proxy.vnPay;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Payment
{
    [Route("[controller]")]
    [ApiController]
    public class BookingPaymentController : ControllerBase
    {

        private readonly IVnPayService _vnPayService;

        public BookingPaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [HttpPost("create-vnpay")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            // Vì ControllerBase vẫn hỗ trợ Redirect, bạn có thể dùng nó
            return Redirect(url);
        }

        [HttpGet("callback-vnpay")]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            return Ok(response);
        }
    }
}
