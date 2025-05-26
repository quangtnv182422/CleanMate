using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.Wallet;

namespace CleanMate_Main.Server.Services.Wallet
{
    public class UserWalletService : IUserWalletService
    {
        private readonly IUserWalletRepo _walletRepo;

        public UserWalletService(IUserWalletRepo walletRepo)
        {
            _walletRepo = walletRepo;
        }


        public async Task<UserWallet> AddNewWalletAsync(string userId)
        {
            var newWallet = new UserWallet
            {
                UserId = userId,
                Balance = 0, // mới tạo nên số dư = 0
                UpdatedAt = DateTime.Now
            };

            return await _walletRepo.AddNewWalletAsync(newWallet);
        }
    }
}
