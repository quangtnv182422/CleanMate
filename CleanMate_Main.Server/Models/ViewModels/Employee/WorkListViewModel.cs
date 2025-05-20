namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class WorkListViewModel
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
