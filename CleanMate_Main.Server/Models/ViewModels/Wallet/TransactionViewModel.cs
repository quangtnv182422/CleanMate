namespace CleanMate_Main.Server.Models.ViewModels.Wallet
{
    public class TransactionViewModel
    {
        public int TransactionId { get; set; }
        public int? BookingId { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; }
        public string Description { get; set; }
    }
}
