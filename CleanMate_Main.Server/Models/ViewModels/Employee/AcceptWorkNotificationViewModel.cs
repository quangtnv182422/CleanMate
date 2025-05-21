namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class AcceptWorkNotificationViewModel
    {
        public int BookingId { get; set; }
        public string CustomerFullName { get; set; } = null!;
        public string CustomerPhoneNumber { get; set; } = null!;
        public string CustomerEmail { get; set; }
    }
}
