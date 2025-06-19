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

    }
}
