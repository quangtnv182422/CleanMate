using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.Services.Payments;
using CleanMate_Main.Server.Services.Wallet;
using CleanMate_Main.Server.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Controllers.Employee
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Cleaner")]
    public class WorkController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IHubContext<WorkHub> _hubContext;
        private readonly IPaymentService _paymentService;
        private readonly IUserWalletService _userWalletService;
        private readonly UserHelper<AspNetUser> _userHelper;
        public WorkController(
            IEmployeeService employeeService,
            UserManager<AspNetUser> userManager,
            IHubContext<WorkHub> hubContext,
            IPaymentService paymentService,
            IUserWalletService userWalletService,
            UserHelper<AspNetUser> userHelper)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _userWalletService = userWalletService ?? throw new ArgumentNullException(nameof(userWalletService));
            _userHelper = userHelper;
        }

        [HttpPost("{id}/start")]
        public async Task<IActionResult> StartWork(int id)
        {
            try
            {
                var employee = await _userHelper.GetCurrentUserAsync();

                if (employee == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                bool success = await _employeeService.BeginWorkRequestAsync(id, employee.Id);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveWorkUpdate");
                    return Ok(new { success, message = "Công việc đã được cập nhật thành trạng thái Đang thực hiện." });
                }
                return BadRequest(new { success = false, message = "Không thể bắt đầu công việc." });
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
                // Log the exception for debugging
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi cập nhật trạng thái công việc." });
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteWork(int id)
        {
            try
            {
                var employee = await _userHelper.GetCurrentUserAsync();

                if (employee == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                bool success = await _employeeService.CompleteWorkRequestAsync(id, employee.Id);
                if (success)
                {
                    var booking = await _employeeService.GetWorkDetailsAsync(id);
                    var payment = await _paymentService.GetPaymentsByBookingIdAsync(id);
                    switch (payment.PaymentMethod)
                    {
                        case PaymentType.Cash:
                            await _paymentService.MarkBookingAsPaidAsync(payment.PaymentId,null);
                            break;
                        case PaymentType.vnPay:
                            //await _userWalletService.AddMoneyAsync(employeeId,booking.decimalCommission, $"Thanh toán tiền nhận công việc {booking.BookingId}", booking.BookingId);
                            throw new NotImplementedException("Phương thức thanh toán vnPay chưa được triển khai.");
                            break;
                        case PaymentType.PayOS:
                            throw new NotImplementedException("Phương thức thanh toán vnPay chưa được triển khai.");
                            //await _userWalletService.AddMoneyAsync(employeeId, booking.decimalCommission, $"Thanh toán tiền nhận công việc {booking.BookingId}", booking.BookingId);
                            break;
                        case PaymentType.CleanMate_Coin:
                            await _userWalletService.AddMoneyAsync(employee.Id, booking.decimalCommission, $"Thanh toán tiền nhận công việc {booking.BookingId}", booking.BookingId);
                            break;
                        default:
                            return BadRequest(new { success = false, message = "Phương thức thanh toán không hợp lệ." });
                    }
                    await _hubContext.Clients.All.SendAsync("ReceiveWorkUpdate");
                    return Ok(new { success, message = "Công việc đã được cập nhật thành trạng thái Chờ xác nhận." });
                }
                return BadRequest(new { success = false, message = "Không thể hoàn thành công việc." });
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
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi cập nhật trạng thái công việc." });
            }
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelWork(int id)
        {
            try
            {
                var employee = await _userHelper.GetCurrentUserAsync();

                if (employee == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                bool success = await _employeeService.CancelWorkRequestAsync(id, employee.Id);
                if (success)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveWorkUpdate");
                    return Ok(new { success, message = "Công việc đã được hủy thành công." });
                }
                return BadRequest(new { success = false, message = "Không thể hủy công việc." });
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
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi không mong muốn khi hủy công việc." });
            }
        }

        
    }
}