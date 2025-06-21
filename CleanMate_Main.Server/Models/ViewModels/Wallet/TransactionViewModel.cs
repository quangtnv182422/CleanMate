namespace CleanMate_Main.Server.Models.ViewModels.Wallet
{
    public class TransactionViewModel
    {
        public int TransactionId { get; set; }
        public int WalletId { get; set; }
        public decimal Amount { get; set; }
        public string TransactionType { get; set; }
        public string Description { get; set; }
        public int Month { get; set; }
        public int Date { get; set; }
        public int? RelatedBookingId { get; set; }
    }
}
