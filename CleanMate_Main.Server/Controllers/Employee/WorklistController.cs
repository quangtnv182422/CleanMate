using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Employee;
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
    public class WorklistController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;

        public WorklistController(IEmployeeService employeeService, UserManager<AspNetUser> userManager)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkList([FromQuery] int? status = null)
        {
            var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized(new { message = "User email not found." });

            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user == null)
                return Unauthorized(new { message = "User not found." });

            string employeeId = user.Id;
            IEnumerable<WorkListViewModel> workItems;

            if (status == Common.CommonConstants.BookingStatus.NEW || status == null)
            {
                // Return only NEW status work items for the employee
                workItems = await _employeeService.GetAllWorkAsync(Common.CommonConstants.BookingStatus.NEW);
            }
            else
            {
                // Return work items for the specified status and employee
                workItems = await _employeeService.GetAllWorkAsync(status, employeeId);
            }

            return Ok(workItems);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkDetail(int id)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { message = "Không tìm thấy email người dùng." });
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
                }

                string employeeId = user.Id;
                var workDetail = await _employeeService.GetWorkDetailsAsync(id);
                return Ok(workDetail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Đã xảy ra lỗi xảy ra!" });
            }
        }

        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptWork(int id)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { message = "Không tìm thấy email người dùng." });
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });
                }

                string employeeId = user.Id;
                bool success = await _employeeService.AcceptWorkRequestAsync(id, employeeId);
                return Ok(new { success, message = "Công việc đã được nhận thành công." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi nhận công việc." });
            }
        }
    }
}

