using CleanMate_Main.Server.Models.ViewModels.Wallet;

namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class EarningsSummaryViewModel
    {
        public decimal TotalEarnings { get; set; }
        public decimal AvailableBalance { get; set; }
        public List<TransactionViewModel> Transactions { get; set; }
        public List<WithdrawRequestViewModel> WithdrawalRequests { get; set; }
    }
}
