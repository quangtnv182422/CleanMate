namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class WorkDetailsViewModel
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string ServiceDescription { get; set; }
        public int Duration { get; set; }
        public decimal Price { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public string Address { get; set; } = null!;
        public string? Note { get; set; }
        public string Status { get; set; } = null!;
        public bool IsRead { get; set; }
        public string CustomerFullName { get; set; }
        public string CustomerPhoneNumber { get; set; }
    }
}
