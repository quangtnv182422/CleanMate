using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using CleanMate_Main.Server.Models.ViewModels.Employee;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.Services.Payments;
using CleanMate_Main.Server.Services.Wallet;
using CleanMate_Main.Server.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly IHubContext<WorkHub> _hubContext;
        private readonly IPaymentService _paymentService;
        private readonly IUserWalletService _userWalletService;
        private readonly UserHelper<AspNetUser> _userHelper;

        public WorklistController(IEmployeeService employeeService, 
                                  UserManager<AspNetUser> userManager, 
                                  IHubContext<WorkHub> hubContext,
                                  IPaymentService paymentService,
                                  IUserWalletService userWalletService,
                                  UserHelper<AspNetUser> userHelper)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _hubContext = hubContext;
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _userWalletService = userWalletService ?? throw new ArgumentNullException(nameof(userWalletService));
            _userHelper = userHelper;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkList([FromQuery] int? status = null)
        {
            var user = await _userHelper.GetCurrentUserAsync();

            if (user == null)
                return Unauthorized(new { message = "Không tìm thấy người dùng." });

            string employeeId = user.Id;
            IEnumerable<WorkListViewModel> workItems;

            if (status == Common.CommonConstants.BookingStatus.NEW || status == null)
            {
                // Return only NEW status work items for the employee
                workItems = await _employeeService.GetAllWorkAsync(Common.CommonConstants.BookingStatus.NEW);
            }
            else
            {
                // Return work items for the specified status and employee
                workItems = await _employeeService.GetAllWorkAsync(status, employeeId);
            }

            return Ok(workItems);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkDetail(int id)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                string employeeId = user.Id;
                var workDetail = await _employeeService.GetWorkDetailsAsync(id);
                return Ok(workDetail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Đã xảy ra lỗi xảy ra!" });
            }
        }

        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptWork(int id)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                string employeeId = user.Id;
                bool success = await _employeeService.AcceptWorkRequestAsync(id, employeeId);
                if (success)
                {
                    var booking = await _employeeService.GetWorkDetailsAsync(id);
                    var payment = await _paymentService.GetPaymentsByBookingIdAsync(id);
                    switch (payment.PaymentMethod)
                    {
                        case PaymentType.Cash:
                            await _userWalletService.DeductMoneyAsync(employeeId, (booking.decimalPrice - booking.decimalCommission), $"Thanh toán tiền nhận công việc {booking.BookingId}", booking.BookingId);
                            break;
                        case PaymentType.vnPay:
                            throw new NotImplementedException("Phương thức thanh toán vnPay chưa được triển khai.");
                        case PaymentType.PayOS:
                            throw new NotImplementedException("Phương thức thanh toán PayOS chưa được triển khai.");
                        case PaymentType.CleanMate_Coin:
                            break;
                        default:
                            return BadRequest(new { success = false, message = "Phương thức thanh toán không hợp lệ." });
                    }
                    await _hubContext.Clients.All.SendAsync("ReceiveWorkUpdate", employeeId);
                    return Ok(new { success, message = "Công việc đã được nhận thành công." });
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi nhận công việc." });
            }
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi nhận công việc." });
        }
    }
}

