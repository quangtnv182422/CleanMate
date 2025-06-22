namespace CleanMate_Main.Server.Models.ViewModels.Customer
{
    public class CustomerReviewSummaryViewModel
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<CustomerReviewViewModel> Reviews { get; set; }
    }
}
