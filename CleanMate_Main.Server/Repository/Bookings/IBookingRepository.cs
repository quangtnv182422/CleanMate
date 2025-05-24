using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Bookings
{
    public interface IBookingRepository
    {
        Task<Booking> AddBookingAsync(Booking booking);
        Task<Booking?> GetBookingByIdAsync(int bookingId);
    }
}
