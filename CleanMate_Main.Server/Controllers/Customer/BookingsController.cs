using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Bookings;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
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
    }
}
