using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.Enum;
using CleanMate_Main.Server.Repository.Vouchers;

namespace CleanMate_Main.Server.Services.Vouchers
{
    public class VoucherService : IVoucherService
    {
        private readonly IVoucherRepository _voucherRepository;

        public VoucherService(IVoucherRepository voucherRepository)
        {
            _voucherRepository = voucherRepository;
        }

        public async Task<IEnumerable<VoucherDTO>> GetAllVouchersAsync()
        {
            var vouchers = await _voucherRepository.GetAllVouchersAsync();
            return vouchers.Select(v => new VoucherDTO
            {
                VoucherId = v.VoucherId,
                Description = v.Description,
                DiscountPercentage = v.DiscountPercentage,
                CreatedAt = v.CreatedAt,
                ExpireDate = v.ExpireDate,
                VoucherCode = v.VoucherCode,
                IsEventVoucher = v.IsEventVoucher,
                CreatedBy = v.CreatedBy,
                Status = v.Status
            }).ToList();
        }

        public async Task<VoucherDTO> GetVoucherByIdAsync(int voucherId)
        {
            var voucher = await _voucherRepository.GetVoucherByIdAsync(voucherId);
            if (voucher == null) return null;
            return new VoucherDTO
            {
                VoucherId = voucher.VoucherId,
                Description = voucher.Description,
                DiscountPercentage = voucher.DiscountPercentage,
                CreatedAt = voucher.CreatedAt,
                ExpireDate = voucher.ExpireDate,
                VoucherCode = voucher.VoucherCode,
                IsEventVoucher = voucher.IsEventVoucher,
                CreatedBy = voucher.CreatedBy,
                Status = voucher.Status
            };
        }

        public async Task CreateVoucherAsync(VoucherDTO voucherDto, string adminId)
        {
            if (string.IsNullOrEmpty(voucherDto.VoucherCode))
                throw new ArgumentException("Voucher code is required.");

            if (await _voucherRepository.VoucherCodeExistsAsync(voucherDto.VoucherCode))
                throw new InvalidOperationException("Voucher code already exists.");

            var voucher = new Voucher
            {
                Description = voucherDto.Description,
                DiscountPercentage = voucherDto.DiscountPercentage,
                CreatedAt = DateTime.Now,
                ExpireDate = voucherDto.ExpireDate,
                VoucherCode = voucherDto.VoucherCode,
                IsEventVoucher = voucherDto.IsEventVoucher,
                CreatedBy = adminId,
                Status = VoucherStatus.ACTIVE
            };

            await _voucherRepository.AddVoucherAsync(voucher);
        }

        public async Task UpdateVoucherAsync(VoucherDTO voucherDto)
        {
            var voucher = await _voucherRepository.GetVoucherByIdAsync(voucherDto.VoucherId);
            if (voucher == null)
                throw new KeyNotFoundException("Voucher not found.");

            voucher.Description = voucherDto.Description;
            voucher.DiscountPercentage = voucherDto.DiscountPercentage;
            voucher.ExpireDate = voucherDto.ExpireDate;
            voucher.VoucherCode = voucherDto.VoucherCode;
            voucher.IsEventVoucher = voucherDto.IsEventVoucher;
            voucher.Status = voucherDto.Status;

            await _voucherRepository.UpdateVoucherAsync(voucher);
        }

        public async Task DeleteVoucherAsync(int voucherId)
        {
            if (!await _voucherRepository.VoucherExistsAsync(voucherId))
                throw new KeyNotFoundException("Voucher not found.");

            await _voucherRepository.DeleteVoucherAsync(voucherId);
        }
    }
}
