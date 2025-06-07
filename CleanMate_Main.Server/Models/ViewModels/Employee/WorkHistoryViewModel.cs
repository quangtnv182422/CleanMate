namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class WorkHistoryViewModel
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; }
        public string CustomerFullName { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public decimal Duration { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public decimal Earnings { get; set; } 
        public double? Rating { get; set; } 
        public string Comment { get; set; } 
        public string Status { get; set; } 
    }
}
