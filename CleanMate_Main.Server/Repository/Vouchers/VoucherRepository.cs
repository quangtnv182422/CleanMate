using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Vouchers
{
    public class VoucherRepository : IVoucherRepository
    {
        private readonly CleanMateMainDbContext _context;

        public VoucherRepository(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Voucher>> GetAllVouchersAsync()
        {
            return await _context.Vouchers.AsNoTracking().ToListAsync();
        }

        public async Task<Voucher> GetVoucherByIdAsync(int voucherId)
        {
            return await _context.Vouchers.AsNoTracking().FirstOrDefaultAsync(v => v.VoucherId == voucherId);
        }

        public async Task AddVoucherAsync(Voucher voucher)
        {
            await _context.Vouchers.AddAsync(voucher);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVoucherAsync(Voucher voucher)
        {
            _context.Vouchers.Update(voucher);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVoucherAsync(int voucherId)
        {
            var voucher = await _context.Vouchers.FindAsync(voucherId);
            if (voucher != null)
            {
                _context.Vouchers.Remove(voucher);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserVoucher>> GetUserVouchersByUserIdAsync(string userId)
        {
            return await _context.UserVouchers
                .Where(uv => uv.UserId == userId)
                .Include(uv => uv.Voucher)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AssignVoucherToUserAsync(string userId, int voucherId, int quantity)
        {
            var userVoucher = new UserVoucher
            {
                UserId = userId,
                VoucherId = voucherId,
                Quantity = quantity,
                IsUsed = false
            };
            await _context.UserVouchers.AddAsync(userVoucher);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> VoucherExistsAsync(int voucherId)
        {
            return await _context.Vouchers.AnyAsync(v => v.VoucherId == voucherId);
        }

        public async Task<bool> VoucherCodeExistsAsync(string voucherCode)
        {
            return await _context.Vouchers.AnyAsync(v => v.VoucherCode == voucherCode);
        }

        public async Task<IEnumerable<UserVoucher>> GetAvailableUserVouchersAsync(string userId)
        {
            return await _context.UserVouchers
                .Where(uv => uv.UserId == userId && !uv.IsUsed && uv.Voucher.ExpireDate >= DateOnly.FromDateTime(DateTimeVN.GetNow()))
                .Include(uv => uv.Voucher)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<UserVoucher> GetUserVoucherByCodeAsync(string userId, string voucherCode)
        {
            return await _context.UserVouchers
                .Where(uv => uv.UserId == userId && uv.Voucher.VoucherCode == voucherCode && !uv.IsUsed && uv.Voucher.ExpireDate >= DateOnly.FromDateTime(DateTimeVN.GetNow()))
                .Include(uv => uv.Voucher)
                .FirstOrDefaultAsync();
        }

        public async Task UpdateUserVoucherAsync(UserVoucher userVoucher)
        {
            _context.UserVouchers.Update(userVoucher);
            await _context.SaveChangesAsync();
        }
    }
}
