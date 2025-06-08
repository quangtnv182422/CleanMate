namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class WorkDetailsViewModel
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string ServiceDescription { get; set; }
        public string Duration { get; set; }
        public string Price { get; set; }
        public string Commission { get; set; }
        public string Date { get; set; }
        public string StartTime { get; set; }
        public string Address { get; set; } = null!;
        public string? Note { get; set; }
        public string Status { get; set; } = null!;
        public int StatusId { get; set; } = 0;
        public bool IsRead { get; set; }
        public string CustomerFullName { get; set; }
        public string CustomerPhoneNumber { get; set; }
        public string? EmployeeId { get; set; }
        public string? PlaceID { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
    }
}
