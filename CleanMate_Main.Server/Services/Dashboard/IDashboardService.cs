namespace CleanMate_Main.Server.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<object> GetDashboardSummaryAsync();
        Task<Dictionary<int, int>> GetBookingsPerMonthAsync();
    }
}
