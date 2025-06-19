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
    }
}
