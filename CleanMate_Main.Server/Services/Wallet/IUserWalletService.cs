using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Wallet
{
    public interface IUserWalletService
    {
        Task<UserWallet> AddNewWalletAsync(string userId);
    }
}
