using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Bookings;
using CleanMate_Main.Server.Services.Employee;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IEmployeeService _employeeService;

        public BookingsController(IBookingService bookingService, IEmployeeService employeeService)
        {
            _bookingService = bookingService;
            _employeeService = employeeService;
        }

        /* [HttpPost("add-booking")]
         public async Task<ActionResult<Booking>> AddBooking([FromBody] BookingCreateDTO dto)
         {
             if (dto == null)
             {
                 return BadRequest("Thông tin đặt lịch không hợp lệ.");
             }

             try
             {
                 var booking = await _bookingService.AddNewBookingAsync(dto);

                 return CreatedAtAction(nameof(GetBookingById), new { bookingId = booking.BookingId }, booking);
             }
             catch (Exception ex)
             {
                 return StatusCode(500, $"Lỗi server: {ex.Message}");
             }
         }


         [HttpGet("get-booking-id/{bookingId}")]
         public async Task<ActionResult<Booking>> GetBookingById(int bookingId)
         {
             var booking = await _bookingService.GetBookingByIdAsync(bookingId);

             if (booking != null)
             {
                 return Ok(booking);
             }
             return NotFound();
         }*/

        [HttpGet("get-bookings")]
        public async Task<ActionResult<List<BookingDTO>>> GetBookingsByUserId([FromQuery] string userId, [FromQuery] int? statusId = null)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId không hợp lệ.");
            }

            try
            {
                var bookings = await _bookingService.GetBookingsByUserIdAsync(userId, statusId);
                if (bookings == null || bookings.Count == 0)
                {
                    return NotFound("Không tìm thấy booking nào.");
                }
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPost("{id}/confirm-complete-work")]
        public async Task<IActionResult> CompleteWork(int statusId)
        {
            try
            {
                bool success = await _employeeService.ConfirmDoneWorkRequestAsync(statusId);
                if (success)
                {
                    //await _hubContext.Clients.All.SendAsync("WorkUpdated");
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
    }
}
