using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Wallet
{
    public class UserWalletRepo : IUserWalletRepo
    {
        private readonly CleanMateMainDbContext _context;

        public UserWalletRepo(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<UserWallet> AddNewWalletAsync(UserWallet wallet)
        {
            await _context.UserWallets.AddAsync(wallet);
            await _context.SaveChangesAsync();

            return wallet;
        }
    }
}
