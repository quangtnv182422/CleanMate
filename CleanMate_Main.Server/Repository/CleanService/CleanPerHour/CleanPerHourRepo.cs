using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.CleanService.CleanPerHour
{
    public class CleanPerHourRepo : ICleanPerHourRepo
    {
        private readonly CleanMateMainDbContext _context;

        public CleanPerHourRepo(CleanMateMainDbContext context) {
            _context = context;
        }
        public async Task<List<CleanerDTO>> GetAllCleanersAsync()
        {
            return await _context.CleanerProfiles
                .Include(c => c.User)
                .Where(c => c.Available == true)
                .Select(c => new CleanerDTO
                {
                    CleanerId = c.UserId,
                    Name = c.User.FullName
                })
                .ToListAsync();
        }

        public async Task<List<string>> GetBookedCleanersAsync(DateOnly requestDate, TimeOnly requestStartTime, TimeOnly requestEndTime)
        {
            // Lấy dữ liệu từ database với các điều kiện đơn giản
            var bookings = await _context.Bookings
                .Where(b => b.BookingStatusId != CommonConstants.BookingStatus.CANCEL
                            && b.Date == requestDate
                            && b.StartTime < requestEndTime)
                .Include(b => b.ServicePrice)
                    .ThenInclude(sp => sp.Duration) // Tải dữ liệu liên quan
                .ToListAsync();

            // Lọc trong bộ nhớ với phép tính thời gian
            var bookedCleaners = bookings
                .Where(b =>
                {
                    if (b.ServicePrice?.Duration == null) return false; // Kiểm tra null
                    var startTime = b.StartTime;
                    var durationHours = b.ServicePrice.Duration.DurationTime;
                    var endTime = TimeOnly.FromTimeSpan(startTime.ToTimeSpan().Add(TimeSpan.FromHours(durationHours)));
                    return endTime > requestStartTime;
                })
                .Select(b => b.CleanerId)
                .Distinct()
                .ToList();

            return bookedCleaners;
        }
    }
}
