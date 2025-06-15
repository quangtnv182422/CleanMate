using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Transaction;
using CleanMate_Main.Server.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class WithdrawRequestController : ControllerBase
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly ITransactionService _transactionService;
        private readonly IHubContext<WorkHub> _hubContext;


        public WithdrawRequestController(
            UserManager<AspNetUser> userManager,
            ITransactionService transactionService,
            IHubContext<WorkHub> hubContext)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _transactionService = transactionService ?? throw new ArgumentNullException(nameof(transactionService));
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWithdrawRequests()
        {
            try
            {
                var requests = await _transactionService.GetAllWithdrawRequestsAsync();
                return Ok(new { success = true, data = requests });
            }
            catch (Exception ex)
            {
                // Log the exception (e.g., using Serilog)
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi lấy danh sách yêu cầu rút tiền." });
            }
        }

        [HttpGet("withdrawrequest/{id}")]
        public async Task<IActionResult> GetWithdrawRequest(int id)
        {
            try
            {
                var request = await _transactionService.GetWithdrawRequestByIdAsync(id);
                return Ok(new { success = true, data = request });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi lấy thông tin yêu cầu rút tiền." });
            }
        }

        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptWithdrawRequest(int id)
        {
            try
            {
                var adminEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(adminEmail))
                {
                    return Unauthorized(new { success = false, message = "Không tìm thấy thông tin quản trị viên." });
                }

                var admin = await _userManager.FindByEmailAsync(adminEmail);
                if (admin == null)
                {
                    return Unauthorized(new { success = false, message = "Không tìm thấy thông tin quản trị viên." });
                }
                var qrCodeUrl = await _transactionService.AcceptWithdrawRequestAsync(id, admin.Id);
                await _hubContext.Clients.All.SendAsync("ReceiveWithdrawUpdate", admin.Id);
                return Ok(new { success = true, message = "Yêu cầu rút tiền đã được chấp nhận.", qrCodeUrl });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi chấp nhận yêu cầu rút tiền." });
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteWithdrawRequest(int id)
        {
            try
            {
                var adminEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(adminEmail))
                {
                    return Unauthorized(new { success = false, message = "Không tìm thấy thông tin quản trị viên." });
                }

                var admin = await _userManager.FindByEmailAsync(adminEmail);
                if (admin == null)
                {
                    return Unauthorized(new { success = false, message = "Không tìm thấy thông tin quản trị viên." });
                }
                var success = await _transactionService.CompleteWithdrawRequestAsync(id, admin.Id);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveWithdrawUpdate", admin.Id);
                    return Ok(new { success, message = "Yêu cầu rút tiền đã được hoàn tất." });
                }
                else
                    return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi từ chối yêu cầu rút tiền." });
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
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi hoàn tất yêu cầu rút tiền." });
            }
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectWithdrawRequest(int id, [FromBody] RejectRequestModel model)
        {
            try
            {
                var adminEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(adminEmail))
                {
                    return Unauthorized(new { success = false, message = "Không tìm thấy thông tin quản trị viên." });
                }

                var admin = await _userManager.FindByEmailAsync(adminEmail);
                if (admin == null)
                {
                    return Unauthorized(new { success = false, message = "Không tìm thấy thông tin quản trị viên." });
                }
                var success = await _transactionService.RejectWithdrawRequestAsync(id, admin.Id, model.AdminNote);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveWithdrawUpdate", admin.Id);
                    return Ok(new { success, message = "Yêu cầu rút tiền đã bị từ chối." });
                }
                else
                    return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi từ chối yêu cầu rút tiền." });
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
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi từ chối yêu cầu rút tiền." });
            }
        }
    }

    public class RejectRequestModel
    {
        public string? AdminNote { get; set; }
    }
}