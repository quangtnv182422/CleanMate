using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Employee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Employee
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Cleaner")]
    public class EarningController : Controller
    {
        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;
        public EarningController(IEmployeeService employeeService, UserManager<AspNetUser> userManager)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }
        [HttpGet]
        public async Task<IActionResult> GetEarningsSummary()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return Unauthorized(new { message = "Không tìm thấy email người dùng." });

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var summary = await _employeeService.GetEarningsSummaryAsync(user.Id);
                return Ok(summary);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy thông tin thu nhập." });
            }
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyEarnings()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return Unauthorized(new { message = "Không tìm thấy email người dùng." });

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var monthlyEarnings = await _employeeService.GetMonthlyEarningsAsync(user.Id);
                return Ok(new { MonthlyEarnings = monthlyEarnings });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy thu nhập tháng này." });
            }
        }
    }
}
