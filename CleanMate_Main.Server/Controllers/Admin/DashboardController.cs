using CleanMate_Main.Server.Services.Dashboard;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var result = await _dashboardService.GetDashboardSummaryAsync();
            return Ok(result);
        }

        [HttpGet("orders-per-month")]
        public async Task<IActionResult> GetOrdersPerMonth()
        {
            var result = await _dashboardService.GetBookingsPerMonthAsync();
            return Ok(result);
        }
    }
}
