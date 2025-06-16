using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.DTO;
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
        public async Task<List<Booking>> GetBookingsByUserIdAsync(string userId, int? statusId)
        {
            var query = _context.Bookings
                                .Include(x => x.ServicePrice)
                                    .ThenInclude(x => x.Duration)
                                .Include(x => x.ServicePrice)
                                    .ThenInclude(x => x.Service)
                                .Include(x => x.BookingStatus)
                                .Include(x => x.Address)
                                .Include(x => x.Cleaner)
                                .Include(x => x.User)
                                .Include(x => x.Feedbacks)
                                .Include(x => x.Payments)
                                .Where(x => x.UserId == userId);

            if (statusId.HasValue)
            {
                query = query.Where(x => x.BookingStatusId == statusId.Value);
            }

            return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }


        public async Task<List<Booking>> GetBookingsForAdminAsync(int? status = null)
        {
            var query = _context.Bookings
                .Include(b => b.ServicePrice)
                    .ThenInclude(sp => sp.Service)
                .Include(b => b.ServicePrice)
                    .ThenInclude(sp => sp.Duration)
                .Include(b => b.BookingStatus)
                .Include(b => b.User)
                .Include(b => b.Address)
                .Include(b => b.Cleaner)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(b => b.BookingStatusId == status.Value);
            }

            query = query.OrderBy(b => b.CreatedAt);

            var bookings = await query.ToListAsync();

            return bookings.ToList();
        }

        public async Task<bool> ProcessBookingAfterAssigningCleanerAsync(int bookingId, string cleanerId)
        {
            // Lấy booking theo ID
            var booking = await _context.Bookings
                .Include(b => b.BookingStatus)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
            {
                throw new Exception("Booking không được tìm thấy.");
            }

            // Kiểm tra trạng thái hiện tại của booking
            if (booking.BookingStatusId != CommonConstants.BookingStatus.NEW &&
                booking.BookingStatusId != CommonConstants.BookingStatus.ACCEPT)
            {
                throw new Exception("Booking không ở trạng thái chính xác để gán cleaner.");
            }

            // Gán cleaner cho booking bằng cách cập nhật CleanerId
            booking.CleanerId = cleanerId;
            booking.BookingStatusId = CommonConstants.BookingStatus.ACCEPT;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> CancelBookingAsync(int bookingId)
        {
            // Lấy booking theo ID
            var booking = await _context.Bookings
                .Include(b => b.BookingStatus)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
            {
                throw new Exception("Booking không được tìm thấy.");
            }

            // Kiểm tra trạng thái hiện tại của booking
            if (booking.BookingStatusId != CommonConstants.BookingStatus.NEW &&
                booking.BookingStatusId != CommonConstants.BookingStatus.ACCEPT)
            {
                throw new Exception("Chỉ có thể hủy booking ở trạng thái NEW hoặc ACCEPT.");
            }

            // Cập nhật trạng thái booking sang CANCELED
            booking.BookingStatusId = CommonConstants.BookingStatus.CANCEL;
            booking.UpdatedAt = DateTimeVN.GetNow(); // Cập nhật thời gian hủy

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
