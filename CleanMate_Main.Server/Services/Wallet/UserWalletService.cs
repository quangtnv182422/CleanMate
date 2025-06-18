using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Common.Utils;
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
                UpdatedAt = DateTimeVN.GetNow()
            };

            return await _walletRepo.AddNewWalletAsync(newWallet);
        }
        public async Task<decimal> GetWalletBalanceAsync(string userId)
        {
            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            return wallet.Balance;
        }

        public async Task<UserWalletDTO> GetWalletAsync(string userId)
        {
            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);

            // Nếu ví không tồn tại, tạo ví mới
            if (wallet == null)
            {
                wallet = await AddNewWalletAsync(userId);
            }

            return new UserWalletDTO
            {
                WalletId = wallet.WalletId,
                UserId = wallet.UserId,
                UserFullName = wallet.User?.FullName ?? "Unknown",
                Balance = wallet.Balance,
                UpdatedAt = wallet.UpdatedAt
            };
        }

        //--Rút tiền---
        public async Task<bool> ExchangeCoinsForMoneyAsync(string userId, decimal amount, string bankAccount, string bankName)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Số tiền yêu cầu phải lớn hơn 0.");
            }
            if (amount < CommonConstants.MINIMUM_DEBIT_AMOUNT) {
                throw new ArgumentException($"Sô tiền cần rút phải lớn hơn {ChangeType.ChangeMoneyType(CommonConstants.MINIMUM_DEBIT_AMOUNT)}");
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
            int transactionId = await _transactionService.RecordTransactionAsync(userId, -amount, TransactionType.Debit, $"Yêu cầu rút tiền từ tài khoản {bankAccount} ({bankName})", null);
            if (transactionId <= 0)
            {
                throw new InvalidOperationException("Không thể ghi lại giao dịch.");
            }
            return true;
        }

        //--Nạp tiền---
        public async Task<bool> ExchangeMoneyForCoinsAsync(string userId, decimal amount, string paymentMethod, string paymentId)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Số tiền yêu cầu phải lớn hơn 0.");
            }
            if (amount < CommonConstants.MINIMUM_DEPOSIT_AMOUNT)
            {
                throw new ArgumentException($"Số tiền nạp phải lớn hơn {ChangeType.ChangeMoneyType(CommonConstants.MINIMUM_DEPOSIT_AMOUNT)}.");
            }

            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);

            // Credit the wallet with the amount (assuming 1:1 conversion; adjust conversion rate if needed)
            bool balanceUpdated = await _walletRepo.UpdateWalletBalanceAsync(userId, amount, $"Nạp tiền từ {paymentMethod}, mã giao dịch:_{paymentId}");
            if (!balanceUpdated)
            {
                throw new InvalidOperationException("Không thể cập nhật số dư ví.");
            }

            // Record the transaction
            int transactionId = await _transactionService.RecordTransactionAsync(userId, amount, TransactionType.Credit, $"Nạp tiền từ {paymentMethod}, mã giao dịch: {paymentId}",null);
            if (transactionId <= 0)
            {
                throw new InvalidOperationException("Không thể ghi lại giao dịch.");
            }

            return true;
        }

        //--Trừ tiền---
        public async Task<bool> DeductMoneyAsync(string userId, decimal amount, string reason, int bookingId)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Số tiền cần trừ phải lớn hơn 0.");
            }

            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            if (wallet == null)
            {
                throw new InvalidOperationException("Ví người dùng không tồn tại.");
            }

            if (wallet.Balance < amount)
            {
                throw new InvalidOperationException("Số dư không đủ để thực hiện giao dịch.");
            }

            // Deduct the amount from the wallet
            bool balanceUpdated = await _walletRepo.UpdateWalletBalanceAsync(userId, -amount, $"Trừ tiền: {reason}");
            if (!balanceUpdated)
            {
                throw new InvalidOperationException("Không thể cập nhật số dư ví.");
            }

            // Record the transaction
            int transactionId = await _transactionService.RecordTransactionAsync(userId, amount, TransactionType.Debit, $"Trừ tiền: {reason}", bookingId);
            if (transactionId <= 0)
            {
                throw new InvalidOperationException("Không thể ghi lại giao dịch.");
            }

            return true;
        }
        public async Task<bool> AddMoneyAsync(string userId, decimal amount, string reason, int bookingId)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Số tiền cần thêm phải lớn hơn 0.");
            }

            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            if (wallet == null)
            {
                throw new InvalidOperationException("Ví người dùng không tồn tại.");
            }

            // Add the amount to the wallet
            bool balanceUpdated = await _walletRepo.UpdateWalletBalanceAsync(userId, amount, $"Thêm tiền: {reason}");
            if (!balanceUpdated)
            {
                throw new InvalidOperationException("Không thể cập nhật số dư ví.");
            }

            // Record the transaction
            int transactionId = await _transactionService.RecordTransactionAsync(userId, amount, TransactionType.Credit, $"Thêm tiền: {reason}", bookingId);
            if (transactionId <= 0)
            {
                throw new InvalidOperationException("Không thể ghi lại giao dịch.");
            }

            return true;
        }
    }
}
