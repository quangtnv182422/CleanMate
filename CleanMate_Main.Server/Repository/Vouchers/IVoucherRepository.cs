using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Vouchers
{
    public interface IVoucherRepository
    {
        Task<IEnumerable<Voucher>> GetAllVouchersAsync();
        Task<Voucher> GetVoucherByIdAsync(int voucherId);
        Task AddVoucherAsync(Voucher voucher);
        Task UpdateVoucherAsync(Voucher voucher);
        Task DeleteVoucherAsync(int voucherId);
        Task<IEnumerable<UserVoucher>> GetUserVouchersByUserIdAsync(string userId);
        Task AssignVoucherToUserAsync(string userId, int voucherId, int quantity);
        Task<bool> VoucherExistsAsync(int voucherId);
        Task<bool> VoucherCodeExistsAsync(string voucherCode);
        Task<IEnumerable<UserVoucher>> GetAvailableUserVouchersAsync(string userId);
        Task<UserVoucher> GetUserVoucherByCodeAsync(string userId, string voucherCode);
        Task UpdateUserVoucherAsync(UserVoucher userVoucher);
    }
}
