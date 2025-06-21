using CleanMate_Main.Server.Models.Enum;

namespace CleanMate_Main.Server.Models.DTO
{
    public class WalletTransactionDTO
    {
        public int TransactionId { get; set; }
        public decimal Amount { get; set; }
        public TransactionType TransactionType { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
