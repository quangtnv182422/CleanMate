namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class CancelWorkRequestViewModel
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; } = null!;
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
    }
}
