using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.Wallet;
using CleanMate_Main.Server.Services.Transaction;

namespace CleanMate_Main.Server.Services.Wallet
{
    public class UserWalletService : IUserWalletService
    {
        private readonly IUserWalletRepo _walletRepo;
        private readonly ITransactionService _transactionService;

        public UserWalletService(IUserWalletRepo walletRepo, ITransactionService transactionService)
        {
            _walletRepo = walletRepo;
            _transactionService = transactionService;
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
        public async Task<decimal> GetWalletBalanceAsync(string userId)
        {
            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            return wallet.Balance;
        }

        public async Task<bool> ExchangeCoinsForMoneyAsync(string userId, decimal amount, string bankAccount, string bankName)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Số tiền yêu cầu phải lớn hơn 0.");
            }

            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            if (wallet.Balance < amount)
            {
                throw new InvalidOperationException("Số dư không đủ để thực hiện giao dịch.");
            }

            // Deduct the amount from the wallet
            bool balanceUpdated = await _walletRepo.UpdateWalletBalanceAsync(userId, -amount, $"Rút tiền sang tài khoản ngân hàng {bankName} ({bankAccount})");
            if (!balanceUpdated)
            {
                throw new InvalidOperationException("Không thể cập nhật số dư ví.");
            }
            
            //Record the transaction
            int transactionId = await _transactionService.RecordTransactionAsync(userId, -amount, TransactionType.Debit, $"Yêu cầu rút tiền từ tài khoản {bankAccount} : {bankName}");
            if (transactionId <= 0)
            {
                throw new InvalidOperationException("Không thể ghi lại giao dịch.");
            }

            // Simulate bank transfer (in a real system, integrate with a payment gateway)
            // For now, assume success if all steps pass
            bool saved = await _walletRepo.SaveChangesAsync();
            return saved;
        }
    }
}
