using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Wallet
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class WalletController : ControllerBase
    {
        private readonly IUserWalletService _walletService;
        private readonly UserManager<AspNetUser> _userManager;
        public WalletController(IUserWalletService walletService, UserManager<AspNetUser> userManager)
        {
            _walletService = walletService;
            _userManager = userManager;
        }

        [HttpGet("get-wallet")]
        public async Task<IActionResult> GetWalletByUserId()
        {
            var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized();

            var user = await _userManager.FindByEmailAsync(userEmail);

            //if (User.Identity?.Name != user.Id && !User.IsInRole("Admin"))
            //    return Unauthorized(new { message = "Bạn không có quyền truy cập ví này." });

            try
            {
                var wallet = await _walletService.GetWalletAsync(user.Id);
                if (wallet == null)
                    return NotFound(new { message = "Không tìm thấy ví cho người dùng này." });

                return Ok(wallet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin ví.", error = ex.Message });
            }
        }
    }
}
