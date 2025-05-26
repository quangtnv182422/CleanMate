using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

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
        public async Task<UserWallet> GetWalletByUserIdAsync(string userId)
        {
            return await _context.UserWallets
                .Include(w => w.User)
                .Include(w => w.Transactions)
                .FirstOrDefaultAsync(w => w.UserId == userId)
                ?? throw new KeyNotFoundException("Không tìm thấy ví cho người dùng này.");
        }

        public async Task<bool> UpdateWalletBalanceAsync(string userId, decimal amount, string transactionDescription)
        {
            var wallet = await GetWalletByUserIdAsync(userId);
            wallet.Balance += amount;
            wallet.UpdatedAt = DateTime.Now;
            return true;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

