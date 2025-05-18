using CleanMate_Main.Server.Models.ViewModels.Authen;
using CleanMate_Main.Server.Services.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Authen
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenController : ControllerBase
    {
        private readonly IAuthenService _authenService;

        public AuthenController(IAuthenService authenService)
        {
            _authenService = authenService;
        }
        
        //đăng kí dành cho khách hàng
        [HttpPost("registercustomer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterModel model)
        {
            var (success, errors) = await _authenService.RegisterCustomerAsync(model);

            if (!success)
                return BadRequest(errors);

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var (success, token, error) = await _authenService.LoginAsync(model);

            if (!success)
                return Unauthorized(error);

            return Ok(new { token });
        }

    }
}
