using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Vouchers
{
    public interface IVoucherService
    {
        Task<IEnumerable<VoucherDTO>> GetAllVouchersAsync();
        Task<VoucherDTO> GetVoucherByIdAsync(int voucherId);
        Task CreateVoucherAsync(VoucherDTO voucherDto, string adminId);
        Task UpdateVoucherAsync(VoucherDTO voucherDto);
        Task DeleteVoucherAsync(int voucherId);
        Task AssignVoucherToUserAsync(string userId, int voucherId, int quantity);
        Task AssignVoucherToUsersAsync(List<string> userIds, int voucherId, int quantity);
        Task<IEnumerable<UserVoucherDTO>> GetAvailableVouchersForUserAsync(string userId);
        Task<ApplyVoucherResult> ApplyVoucherAsync(string userId, string voucherCode, decimal totalAmount);
    }
}
