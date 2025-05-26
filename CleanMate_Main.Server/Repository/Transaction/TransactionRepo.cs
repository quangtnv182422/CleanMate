using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Transaction
{
    public class TransactionRepo : ITransactionRepo
    {
        private readonly CleanMateMainDbContext _context;

        public TransactionRepo(CleanMateMainDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> AddTransactionAsync(WalletTransaction transaction)
        {
            _context.WalletTransactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction.TransactionId;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
