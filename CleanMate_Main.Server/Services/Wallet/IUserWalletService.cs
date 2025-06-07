using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Wallet
{
    public interface IUserWalletService
    {
        Task<UserWallet> AddNewWalletAsync(string userId);
        Task<decimal> GetWalletBalanceAsync(string userId);
        Task<UserWalletDTO> GetWalletAsync(string userId);
        Task<bool> ExchangeCoinsForMoneyAsync(string userId, decimal amount, string bankAccount, string bankName);
        Task<bool> ExchangeMoneyForCoinsAsync(string userId, decimal amount, string paymentMethod, string paymentId);
        Task<bool> DeductMoneyAsync(string userId, decimal amount, string reason);
    }
}