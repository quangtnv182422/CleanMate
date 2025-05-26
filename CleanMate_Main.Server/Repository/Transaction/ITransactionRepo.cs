using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Transaction
{
    public interface ITransactionRepo
    {
        Task<int> AddTransactionAsync(WalletTransaction transaction);
        Task<bool> SaveChangesAsync();
    }
}
