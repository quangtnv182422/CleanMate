using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Services.Customer;
using CleanMate_Main.Server.Services.Employee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class CustomerProfileController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IEmployeeService _employeeService;

        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserHelper<AspNetUser> _userHelper;

        public CustomerProfileController(ICustomerService customerService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper, IEmployeeService employeeService)
        {
            _customerService = customerService ?? throw new ArgumentNullException(nameof(customerService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userHelper = userHelper ?? throw new ArgumentNullException(nameof(userHelper));
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var profile = await _customerService.GetCustomerProfileAsync(user.Id);
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
        public async Task<IActionResult> EditProfile([FromBody] UpdateProfileCustomerViewModel model)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var profile = await _customerService.GetCustomerProfileAsync(user.Id);
                profile.AvatarUrl = model.ProfileImage ?? profile.AvatarUrl;
                var success = await _customerService.UpdateCustomerProfileAsync(profile);
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
        [HttpGet("{cleanerId}")]
        public async Task<IActionResult> GetCleanerProfile(string cleanerId)
        {
            try
            {
                var profile = await _employeeService.GetPersonalProfileAsync(cleanerId);
                if (profile == null)
                {
                    return NotFound(new { message = "Không tìm thấy nhân viên." });
                }
                return Ok(profile);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy thông tin nhân viên." });
            }
        }
    }

    public class UpdateProfileCustomerViewModel
    {
        public string? ProfileImage { get; set; }
        public DateTime? Dob { get; set; }

    }
}