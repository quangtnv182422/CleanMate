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
            //var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //if (string.IsNullOrEmpty(userEmail))
            //    return Unauthorized();

            //var user = await _userManager.FindByEmailAsync(userEmail);

            //if (user == null)
            //    return Unauthorized();

            //string employeeId = user.Id;
            var workItems = await _employeeService.GetAllWorkAsync(Common.CommonConstants.BookingStatus.NEW);
            return Ok(workItems);
        }
    }
}
