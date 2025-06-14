using CleanMate_Main.Server.Common;
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

            query = query.OrderBy(b => b.BookingId);

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
            if (booking.BookingStatusId != CommonConstants.BookingStatus.NEW)
            {
                throw new Exception("Booking không ở trạng thái chính xác để gán cleaner.");
            }

            // Gán cleaner cho booking bằng cách cập nhật CleanerId
            booking.CleanerId = cleanerId;

            await _context.SaveChangesAsync();

            return true;
        }

       /* public async Task<List<CleanerDTO>> GetAvailableCleanersForTimeSlotAsync(DateTime startTime, DateTime endTime)
        {
            // Lấy danh sách tất cả cleaner trong hệ thống (giả sử có 5 cleaner)
            var cleaners = await _context.CleanerProfiles
                .Include(c => c.User)
                //.Where(c => c.Available) // Cleaner đang sẵn sàng làm việc
                .Select(c => new { c.UserId, c.User.FullName })
                .ToListAsync();

            // Chuyển đổi startTime và endTime sang DateOnly và TimeOnly
            var requestDate = DateOnly.FromDateTime(startTime);
            var requestStartTime = TimeOnly.FromDateTime(startTime);
            var requestEndTime = TimeOnly.FromDateTime(endTime);

            // Lấy danh sách cleaner có booking overlap với khoảng thời gian yêu cầu
            var bookedCleaners = await _context.Bookings
                .Where(b => b.BookingStatusId != CommonConstants.BookingStatus.CANCEL // Không tính booking đã hủy
                         && b.Date == requestDate // Chỉ kiểm tra trong cùng ngày
                         && b.StartTime < requestEndTime // Booking bắt đầu trước khi slot yêu cầu kết thúc
                         && TimeOnly.FromTimeSpan(b.StartTime.ToTimeSpan().Add(TimeSpan.FromHours(b.ServicePrice.Duration.DurationTime))) > requestStartTime) // Booking kết thúc sau khi slot yêu cầu bắt đầu
                .Select(b => b.CleanerId)
                .Distinct()
                .ToListAsync();


            // Lọc ra các cleaner không có trong danh sách bookedCleaners
            var availableCleaners = cleaners
                .Where(c => !bookedCleaners.Contains(c.UserId))
                .Select(c => new CleanerDTO
                {
                    CleanerId = c.UserId,
                    Name = c.FullName
                })
                .ToList();

            return availableCleaners;
        }*/

    }
}
