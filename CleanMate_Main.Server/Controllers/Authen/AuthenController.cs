using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Authen;
using CleanMate_Main.Server.Services.Authentication;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.Services.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace CleanMate_Main.Server.Controllers.Authen
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenController : ControllerBase
    {
        private readonly IAuthenService _authenService;
        private readonly IUserWalletService _walletService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IEmployeeService _employeeService;

        public AuthenController(
            IAuthenService authenService,
            UserManager<AspNetUser> userManager,
            IUserWalletService walletService,
            IEmployeeService employeeService)
        {
            _authenService = authenService;
            _userManager = userManager;
            _walletService = walletService;
            _employeeService = employeeService;
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

            return Ok(new { message = "Hãy xác thực tài khoản của ban qua Email!" });
        }

        //đăng kí dành cho người dọn
        [HttpPost("registeremployee")]
        public async Task<IActionResult> RegisterEmployee([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                var validationErrors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { message = "Validation failed", errors = validationErrors });
            }

            var (success, errors) = await _authenService.RegisterEmployeeAsync(model);

            if (!success)
            {
                return BadRequest(new { message = "Registration failed", errors });
            }

            return Ok(new { message = "Hãy xác thực tài khoản của ban qua Email!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var (success, token, error) = await _authenService.LoginAsync(model);

            if (!success)
                return Unauthorized(new { message = error });

            // Set JWT to HttpOnly cookie
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, 
                SameSite = SameSiteMode.None, 
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { message = "Đăng nhập thành công" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Đăng xuất thành công" });
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized();

            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user == null)
                return Unauthorized();

            // Lấy roles nếu cần
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                fullName = user.FullName,
                avatar = user.ProfileImage,  
                roles = roles,
                bankName = user.BankName,
                bankNo = user.BankNo
            });
        }



        //confirm email
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

            await _walletService.AddNewWalletAsync(userId); // NOTE: Confirm mail thành công thì mới tạo ví
            if (await _userManager.IsInRoleAsync(user, "Cleaner"))
            {
                await _employeeService.CreateCleanerProfileAsync(userId);
            }
            return Ok(new { message = "Xác nhận email thành công. Bạn có thể đăng nhập." });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed" });
            }

            var (success, error) = await _authenService.ForgotPasswordAsync(model.Email);

            if (!success)
            {
                return BadRequest(new { message = error });
            }

            return Ok(new { message = "Email đặt lại mật khẩu đã được gửi." });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed" });
            }
            var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized();

            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user == null)
                return Unauthorized();

            var (success, error) = await _authenService.ChangePasswordAsync(user.Id, model.CurrentPassword, model.NewPassword);

            if (!success)
            {
                return BadRequest(new { message = error });
            }

            return Ok(new { message = "Mật khẩu đã được thay đổi thành công." });
        }
    }
}
