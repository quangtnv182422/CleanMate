using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Controllers.Employee
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Cleaner")]
    public class WorkController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IHubContext<WorkHub> _hubContext;
        private const string DefaultCleanerId = "3333f99d-7afd-4d40-aa4b-8fa86d7a39b";

        public WorkController(
            IEmployeeService employeeService,
            UserManager<AspNetUser> userManager,
            IHubContext<WorkHub> hubContext)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        }

        [HttpPost("{id}/start")]
        public async Task<IActionResult> StartWork(int id)
        {
            try
            {
                string employeeId = await GetEmployeeIdAsync();
                bool success = await _employeeService.BeginWorkRequestAsync(id, employeeId);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("WorkUpdated");
                    return Ok(new { success, message = "Công việc đã được cập nhật thành trạng thái Đang thực hiện." });
                }
                return BadRequest(new { success = false, message = "Không thể bắt đầu công việc." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi cập nhật trạng thái công việc." });
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteWork(int id)
        {
            try
            {
                string employeeId = await GetEmployeeIdAsync();
                bool success = await _employeeService.CompleteWorkRequestAsync(id, employeeId);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("WorkUpdated");
                    return Ok(new { success, message = "Công việc đã được cập nhật thành trạng thái Chờ xác nhận." });
                }
                return BadRequest(new { success = false, message = "Không thể hoàn thành công việc." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi cập nhật trạng thái công việc." });
            }
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelWork(int id)
        {
            try
            {
                string employeeId = await GetEmployeeIdAsync();
                bool success = await _employeeService.CancelWorkRequestAsync(id, employeeId);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("WorkUpdated");
                    return Ok(new { success, message = "Công việc đã được hủy thành công." });
                }
                return BadRequest(new { success = false, message = "Không thể hủy công việc." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi hủy công việc." });
            }
        }

        private async Task<string> GetEmployeeIdAsync()
        {
            string employeeId = DefaultCleanerId; // Default for testing
            var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userEmail))
            {
                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user != null)
                {
                    employeeId = user.Id; // Use actual user ID if available
                }
            }
            return employeeId;
        }
    }
}