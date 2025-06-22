using CleanMate_Main.Server.Services.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
   // [Authorize(Roles = "Admin")]
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

        [HttpGet("{userId}/detail")]
        public async Task<IActionResult> GetCustomerDetail(string userId)
        {
            try
            {
                var customerDetail = await _customerService.GetCustomerDetailAsync(userId);
                return Ok(customerDetail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
