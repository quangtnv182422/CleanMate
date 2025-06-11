using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Bookings
{
    public interface IBookingRepository
    {
        Task<Booking> AddBookingAsync(Booking booking);
        Task<Booking?> GetBookingByIdAsync(int bookingId);
        Task<List<Booking>> GetBookingsByUserIdAsync(string userId, int? statusId);
        Task<List<Booking>> GetBookingsForAdminAsync(int? status = null);
        Task<bool> ProcessBookingAfterAssigningCleanerAsync(int bookingId, string cleanerId);


    }
}
