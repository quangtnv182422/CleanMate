using CleanMate_Main.Server.Common.Utils;
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
        private readonly UserHelper<AspNetUser> _userHelper;
        public WalletController(IUserWalletService walletService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper)
        {
            _walletService = walletService;
            _userManager = userManager;
            _userHelper = userHelper;
        }

        [HttpGet("get-wallet")]
        public async Task<IActionResult> GetWalletByUserId()
        {
            var user = await _userHelper.GetCurrentUserAsync();

            if (user == null)
                return Unauthorized(new { message = "Không tìm thấy người dùng." });

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
