using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Customer;
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
        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserHelper<AspNetUser> _userHelper;

        public CustomerProfileController(ICustomerService customerService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper)
        {
            _customerService = customerService ?? throw new ArgumentNullException(nameof(customerService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
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

                var profile = await _customerService.GetPersonalProfileAsync(user.Id);
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
        public async Task<IActionResult> EditProfile([FromBody] UpdateProfileViewModel model)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var profile = await _customerService.GetPersonalProfileAsync(user.Id);
                profile.AvatarUrl = model.ProfileImage ?? profile.AvatarUrl;
                var success = await _customerService.UpdatePersonalProfileAsync(profile);
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

    public class UpdateProfileViewModel
    {
        public string? ProfileImage { get; set; }
        public DateTime? Dob { get; set; }

    }
}