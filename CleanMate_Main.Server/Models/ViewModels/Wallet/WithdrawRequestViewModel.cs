namespace CleanMate_Main.Server.Models.ViewModels.Wallet
{
    public class WithdrawRequestViewModel
    {
        public int WithdrawalId { get; set; }
        public decimal Amount { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } // Pending, Approved, Done, Rejected
    }
}
