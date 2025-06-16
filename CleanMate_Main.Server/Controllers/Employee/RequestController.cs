using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Transaction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize(Roles = "Cleaner")]

    public class RequestController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserHelper<AspNetUser> _userHelper;

        public RequestController(ITransactionService transactionService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper)
        {
            _transactionService = transactionService ?? throw new ArgumentNullException(nameof(transactionService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _userHelper = userHelper;
        }

        [HttpPost("withdraw")]
        public async Task<IActionResult> CreateWithdrawRequest([FromBody] WithdrawRequestModel model)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });


                // Validate bank details
                if (string.IsNullOrEmpty(user.BankName) || string.IsNullOrEmpty(user.BankNo))
                {
                    return BadRequest(new { success = false, message = "Thông tin ngân hàng không hợp lệ. Vui lòng cập nhật thông tin ngân hàng." });
                }

                var requestId = await _transactionService.CreateWithdrawRequestAsync(user.Id, model.Amount);
                return Ok(new { success = true, message = "Yêu cầu rút tiền đã được tạo.", requestId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception (e.g., using Serilog)
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi tạo yêu cầu rút tiền." });
            }
        }
    }

    public class WithdrawRequestModel
    {
        public decimal Amount { get; set; }
    }
}