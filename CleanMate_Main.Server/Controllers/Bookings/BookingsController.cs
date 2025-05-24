using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Bookings;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Bookings
{
    [Route("[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost("add-booking")]
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
        }
    }
}
