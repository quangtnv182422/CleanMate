using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Transaction
{
    public interface ITransactionRepo
    {
        Task<int> AddTransactionAsync(WalletTransaction transaction);
        Task<IEnumerable<WithdrawRequest>> GetAllWithdrawRequestsAsync();
        Task<WithdrawRequest> GetWithdrawRequestByIdAsync(int requestId);
        Task<int> CreateWithdrawRequestAsync(WithdrawRequest request);
        Task<bool> UpdateWithdrawRequestAsync(int requestId, WithdrawRequest updatedRequest);
        Task<bool> ExecuteWithdrawTransactionAsync(int requestId, string adminId, decimal amount, string userId);
        Task<decimal> GetPendingWithdrawAmountAsync(string userId);

    }
}
