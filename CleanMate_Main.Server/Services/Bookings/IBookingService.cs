using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Bookings
{
    public interface IBookingService
    {
        Task<Booking> AddNewBookingAsync(BookingCreateDTO booking);
        Task<Booking?> GetBookingByIdAsync(int bookingId);
        Task<List<BookingDTO>> GetBookingsByUserIdAsync(string userId, int? statusId);
        Task<List<BookingAdminDTO>> GetBookingsForAdminAsync(int? status = null);
        Task<bool> ProcessBookingAfterAssigningCleanerAsync(int bookingId, string cleanerId);
        Task<bool> CancelBookingAsync(int bookingId);

    }
}
