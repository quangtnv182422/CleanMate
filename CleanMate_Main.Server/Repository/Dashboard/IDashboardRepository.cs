namespace CleanMate_Main.Server.Repository.Dashboard
{
    public interface IDashboardRepository
    {
        Task<int> GetTotalBookingsAsync();
        Task<decimal> GetTotalRevenueAsync();
        Task<int> GetTotalCleanersAsync();
        Task<int> GetTotalUsersAsync();
        Task<Dictionary<int, int>> GetMonthlyBookingCountsAsync();
    }
}
