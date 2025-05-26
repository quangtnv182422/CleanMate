using CleanMate_Main.Server.Models.Enum;

namespace CleanMate_Main.Server.Services.Transaction
{
    public interface ITransactionService
    {
        Task<int> RecordTransactionAsync(string userId, decimal amount, TransactionType transactionType, string description);
    }
}
