using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using CleanMate_Main.Server.Proxy.VietQR;
using CleanMate_Main.Server.Repository.Transaction;
using CleanMate_Main.Server.Repository.Wallet;
using CleanMate_Main.Server.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.Services.Transaction
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepo _transactionRepo;
        private readonly IUserWalletRepo _walletRepo;
        private readonly IVIetQRService _vietQRService;
        private readonly UserManager<AspNetUser> _userManager;

        public TransactionService(
            ITransactionRepo transactionRepo,
            IUserWalletRepo walletRepo,
            IVIetQRService vietQRService,
            UserManager<AspNetUser> userManager)
        {
            _transactionRepo = transactionRepo ?? throw new ArgumentNullException(nameof(transactionRepo));
            _walletRepo = walletRepo ?? throw new ArgumentNullException(nameof(walletRepo));
            _vietQRService = vietQRService ?? throw new ArgumentNullException(nameof(vietQRService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        public async Task<int> RecordTransactionAsync(string userId, decimal amount, TransactionType transactionType, string description, int? bookingId)
        {
            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            var transaction = new WalletTransaction
            {
                WalletId = wallet.WalletId,
                Amount = amount,
                TransactionType = transactionType,
                Description = description,
                CreatedAt = DateTime.Now,
                RelatedBookingId = bookingId ?? null
            };

            return await _transactionRepo.AddTransactionAsync(transaction);
        }

        public async Task<int> CreateWithdrawRequestAsync(string userId, decimal amount)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Số tiền yêu cầu phải lớn hơn 0.");
            }
            if (amount < CommonConstants.MINIMUM_DEBIT_AMOUNT)
            {
                throw new ArgumentException($"Số tiền rút phải lớn hơn {CommonConstants.ChangeMoneyType(CommonConstants.MINIMUM_DEBIT_AMOUNT)}.");
            }

            var wallet = await _walletRepo.GetWalletByUserIdAsync(userId);
            var pendingWithdrawAmount = await _transactionRepo.GetPendingWithdrawAmountAsync(userId);
            var totalRequestedAmount = pendingWithdrawAmount + amount;

            if (totalRequestedAmount > wallet.Balance)
            {
                throw new InvalidOperationException($"Tổng số tiền yêu cầu rút ({CommonConstants.ChangeMoneyType(totalRequestedAmount)}) vượt quá số dư ví ({CommonConstants.ChangeMoneyType(wallet.Balance)}).");
            }

            var request = new WithdrawRequest
            {
                UserId = userId,
                Amount = amount,
                Status = WithdrawStatus.Pending,
                RequestedAt = DateTime.Now
            };

            return await _transactionRepo.CreateWithdrawRequestAsync(request);
        }

        public async Task<IEnumerable<WithdrawRequest>> GetAllWithdrawRequestsAsync()
        {
            return await _transactionRepo.GetAllWithdrawRequestsAsync();
        }

        public async Task<WithdrawRequest> GetWithdrawRequestByIdAsync(int requestId)
        {
            return await _transactionRepo.GetWithdrawRequestByIdAsync(requestId);
        }

        public async Task<string> AcceptWithdrawRequestAsync(int requestId, string adminId)
        {
            var request = await _transactionRepo.GetWithdrawRequestByIdAsync(requestId);
            if (request.Status != WithdrawStatus.Pending)
            {
                throw new InvalidOperationException("Yêu cầu rút tiền không ở trạng thái Chờ xử lý.");
            }

            // Get user bank details using UserManager
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null || string.IsNullOrEmpty(user.BankNo) || string.IsNullOrEmpty(user.BankName))
            {
                throw new InvalidOperationException("Thông tin ngân hàng của người dùng không hợp lệ.");
            }

            // Generate QR code URL using IVietQRService
            var qrCodeUrl = await _vietQRService.GenerateQRCodeUrl(
                bankId: user.BankName,
                accountNo: user.BankNo,
                amount: request.Amount,
                description: $"Rút tiền yêu cầu #{requestId}"
            );

            // Update withdraw request
            request.Status = WithdrawStatus.Approved;
            request.ProcessedBy = adminId;

            bool update = await _transactionRepo.UpdateWithdrawRequestAsync(requestId, request);

            return qrCodeUrl;
        }

        public async Task<bool> CompleteWithdrawRequestAsync(int requestId, string adminId)
        {
            // Validate request
            var request = await _transactionRepo.GetWithdrawRequestByIdAsync(requestId);
            if (request.Status != WithdrawStatus.Approved)
            {
                throw new InvalidOperationException("Yêu cầu rút tiền không ở trạng thái Xác nhận.");
            }

            // Validate wallet balance
            var wallet = await _walletRepo.GetWalletByUserIdAsync(request.UserId);
            if (wallet.Balance < request.Amount)
            {
                throw new InvalidOperationException("Số dư ví không đủ để hoàn tất giao dịch.");
            }


            // Execute the transaction
             bool check = await _transactionRepo.ExecuteWithdrawTransactionAsync(
                requestId,
                adminId,
                request.Amount,
                request.UserId
            );
            if (!check)
            {
                throw new InvalidOperationException("Không thể hoàn tất giao dịch rút tiền.");
            }
            request.Status = WithdrawStatus.Done;
            return await _transactionRepo.UpdateWithdrawRequestAsync(requestId, request);
        }
        public async Task<bool> RejectWithdrawRequestAsync(int requestId, string adminId, string? adminNote)
        {
            var request = await _transactionRepo.GetWithdrawRequestByIdAsync(requestId);
            if (request.Status != WithdrawStatus.Pending)
            {
                throw new InvalidOperationException("Yêu cầu rút tiền không ở trạng thái Chờ xử lý.");
            }

            request.Status = WithdrawStatus.Rejected;
            request.ProcessedAt = DateTime.Now;
            request.ProcessedBy = adminId;
            request.AdminNote = adminNote;

            return await _transactionRepo.UpdateWithdrawRequestAsync(requestId, request);
        }
    }
}