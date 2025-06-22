using CleanMate_Main.Server.Common.Utils;
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
    public class EmployeeProfileController : Controller
    {

        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserHelper<AspNetUser> _userHelper;
        public EmployeeProfileController(IEmployeeService employeeService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _userHelper = userHelper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var profile = await _employeeService.GetPersonalProfileAsync(user.Id);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy thông tin hồ sơ." });
            }
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditProfile([FromBody] UpdateProfileEmployeeViewModel model)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var profile = await _employeeService.GetPersonalProfileAsync(user.Id);
                profile.AvatarUrl = model.ProfileImage ?? profile.AvatarUrl;
                profile.BankName = model.BankName ?? profile.BankName;
                profile.BankNo = model.BankNo ?? profile.BankNo;

                var success = await _employeeService.UpdatePersonalProfileAsync(profile);
                return Ok(new { success, message = success ? "Cập nhật hồ sơ thành công." : "Cập nhật hồ sơ thất bại." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật hồ sơ." });
            }
        }
    }

    public class UpdateProfileEmployeeViewModel
    {
        public string? ProfileImage { get; set; }
        public string? BankName { get; set; }
        public string? BankNo { get; set; }
        public DateTime? Dob { get; set; }

    }
}

