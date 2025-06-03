using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Bookings
{
    public class BookingRepository : IBookingRepository
    {
        private readonly CleanMateMainDbContext _context;

        public BookingRepository(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> AddBookingAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();

            return booking;
        }

        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _context.Bookings
                                        .Include(x => x.ServicePrice)
                                            .ThenInclude(x => x.Duration)
                                        .Include(x => x.ServicePrice)
                                            .ThenInclude(x => x.Service) 
                                        .Include(x => x.BookingStatus)
                                        .Include(x => x.Address)
                                        .Include(x => x.Cleaner)
                                        .Include(x => x.User)
                                        .FirstOrDefaultAsync(x => x.BookingId == bookingId);
            return booking;
        }
    }
}
