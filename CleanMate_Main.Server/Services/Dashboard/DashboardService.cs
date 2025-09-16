using CleanMate_Main.Server.Repository.Dashboard;

namespace CleanMate_Main.Server.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetDashboardSummaryAsync()
        {
            var totalBookings = await _repository.GetTotalBookingsAsync();
            var totalRevenue = await _repository.GetTotalRevenueAsync();
            var totalCleaners = await _repository.GetTotalCleanersAsync();
            var totalUsers = await _repository.GetTotalUsersAsync();

            return new
            {
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                TotalCleaners = totalCleaners,
                TotalUsers = totalUsers
            };
        }

        public async Task<List<object>> GetBookingsPerMonthAsync()
        {
            var rawData = await _repository.GetMonthlyBookingCountsAsync();

            var result = Enumerable.Range(1, 12)
                .Select(month => new
                {
                    name = $"Tháng {month}",
                    bookings = rawData.ContainsKey(month) ? rawData[month] : 0
                })
                .Cast<object>()
                .ToList();

            return result;
        }

    }
}
