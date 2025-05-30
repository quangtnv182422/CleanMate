using Azure.Core;
using CleanMate_Main.Server.Models.DTO.VietQR;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Proxy.VietQR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class PaymentController : ControllerBase
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IVIetQRService _vietQRService;

        public PaymentController(UserManager<AspNetUser> userManager, IVIetQRService vIetQRService)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _vietQRService = vIetQRService ?? throw new ArgumentNullException(nameof(vIetQRService));
        }

        [HttpPost("generate-qr")]
        public async Task<IActionResult> GeneratePaymentQRCode([FromBody] QrRequestModel request)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { message = "Không tìm thấy email người dùng." });
                }

                var admin = await _userManager.FindByEmailAsync(userEmail);
                if (admin == null)
                {
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });
                }

                string cleanerUserId = request.CleanerUserId;
                var qrDataUrl = await _adminService.GeneratePaymentQRCodeAsync(cleanerUserId, request.Amount, request.AddInfo);
                return Ok(new { qrDataUrl, message = "Mã QR đã được tạo thành công." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi không mong muốn khi tạo mã QR." });
            }
        }
    }
}
