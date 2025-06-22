using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Services.Bookings;
using CleanMate_Main.Server.Services.Employee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles ="Admin")]
    public class ManageBookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IEmployeeService _employeeService;
        public ManageBookingController(IBookingService bookingService, IEmployeeService employeeService)
        {
            _bookingService = bookingService;
            _employeeService = employeeService;
        }

        [HttpGet("get-booking-admin")]
        public async Task<IActionResult> GetBookings([FromQuery] int? status = null)

        {
            var result = await _bookingService.GetBookingsForAdminAsync(status);
            return Ok(result);
        }

        [HttpGet("get-cleaners")]
        public async Task<IActionResult> GetAvailableCleaners()
        {
            var cleaners = await _employeeService.GetAvailableCleanersAsync();
            return Ok(cleaners);
        }

        [HttpPost("assign-cleaner")]
        public async Task<IActionResult> AssignCleanerToBooking([FromBody] AssignCleanerDTO request)
        {
            var success = await _bookingService.ProcessBookingAfterAssigningCleanerAsync(request.BookingId, request.CleanerId);
            if (success)
            {
                return Ok("Cleaner assigned successfully.");
            }
            return BadRequest("Failed to assign cleaner.");
        }

        [HttpPost("cancel-booking")]
        public async Task<IActionResult> CancelBooking([FromBody] CancelBookingDTO request)
        {
            try
            {
                var success = await _bookingService.CancelBookingAsync(request.BookingId);
                if (success)
                {
                    return Ok("Booking canceled successfully.");
                }
                return BadRequest("Failed to cancel booking.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
