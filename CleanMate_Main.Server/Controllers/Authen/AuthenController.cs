using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Authen;
using CleanMate_Main.Server.Services.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net;
using System.Text;

namespace CleanMate_Main.Server.Controllers.Authen
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenController : ControllerBase
    {
        private readonly IAuthenService _authenService;
        private readonly UserManager<AspNetUser> _userManager;
        public AuthenController(IAuthenService authenService, UserManager<AspNetUser> userManager)
        {
            _authenService = authenService;
            _userManager = userManager;
        }
        
        //đăng kí dành cho khách hàng
        [HttpPost("registercustomer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                var validationErrors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { message = "Validation failed", errors = validationErrors });
            }

            var (success, errors) = await _authenService.RegisterCustomerAsync(model);

            if (!success)
            {
                return BadRequest(new { message = "Registration failed", errors });
            }

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var (success, token, error) = await _authenService.LoginAsync(model);

            if (!success)
                return Unauthorized(error);

            return Ok(new { token });
        }


        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            {
                return StatusCode(400, new { message = "Thiếu thông tin userId hoặc token." });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return StatusCode(404, new { message = "Không tìm thấy người dùng." });
            }

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
            {
                return StatusCode(400, new { message = "Xác nhận email thất bại.", errors = result.Errors });
            }

            return Ok(new { message = "Xác nhận email thành công. Bạn có thể đăng nhập." });
        }

    }
}
