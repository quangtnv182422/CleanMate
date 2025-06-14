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
                .Select(c => new CleanerDTO
                {
                    CleanerId = c.UserId,
                    Name = c.User.FullName
                })
                .ToListAsync();
        }

        public async Task<List<string>> GetBookedCleanersAsync(DateOnly requestDate, TimeOnly requestStartTime, TimeOnly requestEndTime)
        {
            return await _context.Bookings
                .Where(b => b.BookingStatusId != CommonConstants.BookingStatus.CANCEL
                         && b.Date == requestDate
                         && b.StartTime < requestEndTime
                         && TimeOnly.FromTimeSpan(b.StartTime.ToTimeSpan().Add(TimeSpan.FromHours(b.ServicePrice.Duration.DurationTime))) > requestStartTime)
                .Select(b => b.CleanerId)
                .Distinct()
                .ToListAsync();
        }
    }
}
