using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
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
    }
}