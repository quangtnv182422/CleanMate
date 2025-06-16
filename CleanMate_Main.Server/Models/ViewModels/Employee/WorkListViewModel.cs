namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class WorkListViewModel
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; }
        public string CustomerFullName { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public int Duration { get; set; }
        public string Address { get; set; }
        public string Note { get; set; } 
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
