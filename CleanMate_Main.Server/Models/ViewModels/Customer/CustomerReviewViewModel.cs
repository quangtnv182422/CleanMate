namespace CleanMate_Main.Server.Models.ViewModels.Customer
{
    public class CustomerReviewViewModel
    {
        public int BookingId { get; set; }
        public string CustomerFullName { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}
