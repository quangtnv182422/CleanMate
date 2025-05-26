using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Wallet
{
    public interface IUserWalletRepo
    {
        Task<UserWallet> AddNewWalletAsync(UserWallet wallet);
        Task<UserWallet> GetWalletByUserIdAsync(string userId);
        Task<bool> UpdateWalletBalanceAsync(string userId, decimal amount, string transactionDescription);
        Task<bool> SaveChangesAsync();
    }
}
