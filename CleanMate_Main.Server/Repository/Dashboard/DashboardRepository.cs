using CleanMate_Main.Server.Models.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Dashboard
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly CleanMateMainDbContext _context;

        public DashboardRepository(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalBookingsAsync()
        {
            return await _context.Bookings.CountAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _context.Bookings
                .Where(b => b.BookingStatusId == 6 && b.TotalPrice != null)
                .SumAsync(b => b.TotalPrice.Value * 0.2m);
        }

        public async Task<int> GetTotalCleanersAsync()
        {
            return await _context.CleanerProfiles.CountAsync();
        }

        public async Task<int> GetTotalUsersAsync()
        {
            var allUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
            var cleanerUserIds = await _context.CleanerProfiles.Select(c => c.UserId).ToListAsync();
            return allUserIds.Except(cleanerUserIds).Count();
        }

        public async Task<Dictionary<int, int>> GetMonthlyBookingCountsAsync()
        {
            return await _context.Bookings
                .GroupBy(b => b.Date.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Month, x => x.Count);
        }
    }
}
