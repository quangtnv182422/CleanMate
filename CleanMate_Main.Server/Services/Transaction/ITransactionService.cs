using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Services.Transaction
{
    public interface ITransactionService
    {
        Task<int> RecordTransactionAsync(string userId, decimal amount, TransactionType transactionType, string description, int? bookingId);
        Task<int> CreateWithdrawRequestAsync(string userId, decimal amount);
        Task<IEnumerable<WithdrawRequest>> GetAllWithdrawRequestsAsync();
        Task<WithdrawRequest> GetWithdrawRequestByIdAsync(int requestId);
        Task<string> AcceptWithdrawRequestAsync(int requestId, string adminId);
        Task<bool> CompleteWithdrawRequestAsync(int requestId, string adminId);
        Task<bool> RejectWithdrawRequestAsync(int requestId, string adminId, string? adminNote);
    }
}