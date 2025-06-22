namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class FeedbackHistoryViewModel
    {
        public int BookingId { get; set; }
        public DateTime Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public double? Rating { get; set; }
        public string? Content { get; set; }
        public string CustomerFullName { get; set; }
    }
}
