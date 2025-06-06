using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Bookings
{
    public interface IBookingService
    {
        Task<Booking> AddNewBookingAsync(BookingCreateDTO booking);
        Task<Booking?> GetBookingByIdAsync(int bookingId);
        Task<List<BookingDTO>> GetBookingsByUserIdAsync(string userId, int? statusId);
    }
}
