using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using CleanMate_Main.Server.Repository.Transaction;
using CleanMate_Main.Server.Repository.Wallet;

namespace CleanMate_Main.Server.Services.Transaction
{
    public class TransactionService
    {
        private readonly ITransactionRepo _transactionRepo;
        private readonly IUserWalletRepo _walletRepo;

        public TransactionService(ITransactionRepo transactionRepo, IUserWalletRepo walletRepo)
        {
            _transactionRepo = transactionRepo ?? throw new ArgumentNullException(nameof(transactionRepo));
            _walletRepo = walletRepo ?? throw new ArgumentNullException(nameof(walletRepo));
        }

        public async Task<int> RecordTransactionAsync(string userId, decimal amount, TransactionType transactionType, string description)
        {
            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            var transaction = new WalletTransaction
            {
                WalletId = wallet.WalletId,
                Amount = amount,
                TransactionType = transactionType,
                Description = description,
                CreatedAt = DateTime.Now
            };

            int transactionId = await _transactionRepo.AddTransactionAsync(transaction);
            return transactionId;
        }
    }
}
