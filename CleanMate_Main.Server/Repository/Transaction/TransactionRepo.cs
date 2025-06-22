using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<IEnumerable<WithdrawRequest>> GetAllWithdrawRequestsAsync()
        {
            return await _context.WithdrawRequests
                .Include(r => r.User)
                .Include(r => r.Admin)
                .Include(r => r.Transaction)
                .ToListAsync();
        }

        public async Task<WithdrawRequest> GetWithdrawRequestByIdAsync(int requestId)
        {
            var request = await _context.WithdrawRequests
                .Include(r => r.User)
                .Include(r => r.Admin)
                .Include(r => r.Transaction)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);
            return request ?? throw new KeyNotFoundException($"Withdraw request with ID {requestId} not found.");
        }

        public async Task<int> CreateWithdrawRequestAsync(WithdrawRequest request)
        {
            _context.WithdrawRequests.Add(request);
            await _context.SaveChangesAsync();
            return request.RequestId;
        }

        public async Task<bool> UpdateWithdrawRequestAsync(int requestId, WithdrawRequest updatedRequest)
        {
            var request = await _context.WithdrawRequests.FindAsync(requestId);
            if (request == null)
            {
                return false;
            }

            request.Status = updatedRequest.Status;
            request.ProcessedAt = updatedRequest.ProcessedAt;
            request.AdminNote = updatedRequest.AdminNote;
            request.TransactionId = updatedRequest.TransactionId;
            request.ProcessedBy = updatedRequest.ProcessedBy;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ExecuteWithdrawTransactionAsync(int requestId, string adminId, decimal amount, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Update wallet balance
                var wallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == userId);
                if (wallet == null)
                {
                    throw new InvalidOperationException("Ví của người dùng không tồn tại.");
                }

                wallet.Balance -= amount;
                wallet.UpdatedAt = DateTimeVN.GetNow();

                // Record transaction
                var walletTransaction = new WalletTransaction
                {
                    WalletId = wallet.WalletId,
                    Amount = -amount,
                    TransactionType = TransactionType.Debit,
                    Description = $"Rút tiền theo yêu cầu #{requestId}",
                    CreatedAt = DateTimeVN.GetNow()
                };
                int transactionId = await AddTransactionAsync(walletTransaction);

                // Update withdraw request
                var request = await _context.WithdrawRequests.FindAsync(requestId);
                if (request == null)
                {
                    throw new KeyNotFoundException($"Yêu cầu rút tiền với ID {requestId} không tồn tại.");
                }

                request.ProcessedAt = DateTimeVN.GetNow();
                request.TransactionId = transactionId;

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw; // Re-throw for service handling
            }
        }
        public async Task<decimal> GetPendingWithdrawAmountAsync(string userId)
        {
            return await _context.WithdrawRequests
                .Where(r => r.UserId == userId && r.Status == WithdrawStatus.Pending)
                .SumAsync(r => r.Amount);
        }
    }
}