using CleanMate_Main.Server.Services.Employee;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    public class EmployeeListController : ControllerBase
    {

        private readonly IEmployeeService _cleanerService;

        public EmployeeListController(IEmployeeService cleanerService)
        {
            _cleanerService = cleanerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCleanerList()
        {
            var cleaners = await _cleanerService.GetCleanerListAsync();
            return Ok(cleaners);
        }

        [HttpGet("{cleanerId}/detail")]
        public async Task<IActionResult> GetCleanerDetail(string cleanerId)
        {
            var cleanerDetail = await _cleanerService.GetCleanerDetailAsync(cleanerId);
            if (cleanerDetail == null)
            {
                return NotFound("Không tìm thấy cleaner.");
            }
            return Ok(cleanerDetail);
        }

        [HttpPost("{cleanerId}/toggle-availability")]
        public async Task<IActionResult> ToggleCleanerAvailability(string cleanerId, [FromBody] bool isAvailable)
        {
            await _cleanerService.ToggleCleanerAvailabilityAsync(cleanerId, isAvailable);
            return Ok(new { message = "Đã cập nhật tình trạng cleaner." });
        }
    }
}
