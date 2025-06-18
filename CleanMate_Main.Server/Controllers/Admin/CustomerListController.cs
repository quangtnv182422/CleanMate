using CleanMate_Main.Server.Services.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CustomerListController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerListController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerList()
        {
            var customers = await _customerService.GetCustomerListAsync();
            return Ok(customers);
        }

        [HttpPost("{userId}/lock")]
        public async Task<IActionResult> LockUserAccount(string userId)
        {
            await _customerService.LockUserAccountAsync(userId);
            return Ok(new { message = "Tài khoản đã được khóa." });
        }

        [HttpPost("{userId}/unlock")]
        public async Task<IActionResult> UnlockUserAccount(string userId)
        {
            await _customerService.UnlockUserAccountAsync(userId);
            return Ok(new { message = "Tài khoản đã được mở khóa." });
        }
    }
}
