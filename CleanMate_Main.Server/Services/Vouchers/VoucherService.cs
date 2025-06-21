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
                CreatedAt = DateTimeVN.GetNow(),
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

        public async Task AssignVoucherToUserAsync(string userId, int voucherId, int quantity)
        {
            if (!await _voucherRepository.VoucherExistsAsync(voucherId))
                throw new KeyNotFoundException("Voucher not found.");

            await _voucherRepository.AssignVoucherToUserAsync(userId, voucherId, quantity);
        }

        public async Task AssignVoucherToUsersAsync(List<string> userIds, int voucherId, int quantity)
        {
            if (!await _voucherRepository.VoucherExistsAsync(voucherId))
                throw new KeyNotFoundException("Voucher not found.");

            foreach (var userId in userIds)
            {
                await _voucherRepository.AssignVoucherToUserAsync(userId, voucherId, quantity);
            }
        }

        public async Task<IEnumerable<UserVoucherDTO>> GetAvailableVouchersForUserAsync(string userId)
        {
            var userVouchers = await _voucherRepository.GetAvailableUserVouchersAsync(userId);
            return userVouchers.Select(uv => new UserVoucherDTO
            {
                UserVoucherId = uv.UserVoucherId,
                VoucherId = uv.VoucherId,
                VoucherCode = uv.Voucher.VoucherCode,
                Description = uv.Voucher.Description,
                DiscountPercentage = uv.Voucher.DiscountPercentage,
                ExpireDate = uv.Voucher.ExpireDate
            }).ToList();
        }

        public async Task<ApplyVoucherResult> ApplyVoucherAsync(string userId, string voucherCode, decimal totalAmount)
        {
            var userVoucher = await _voucherRepository.GetUserVoucherByCodeAsync(userId, voucherCode);
            if (userVoucher == null)
            {
                return new ApplyVoucherResult
                {
                    Success = false,
                    Message = "Voucher không hợp lệ hoặc đã hết hạn."
                };
            }

            decimal discountAmount = totalAmount * (userVoucher.Voucher.DiscountPercentage / 100);
            decimal newTotal = totalAmount - discountAmount;

            userVoucher.IsUsed = true;
            userVoucher.UsedAt = DateTimeVN.GetNow();
            await _voucherRepository.UpdateUserVoucherAsync(userVoucher);

            return new ApplyVoucherResult
            {
                Success = true,
                Message = "Áp dụng voucher thành công.",
                DiscountAmount = discountAmount,
                NewTotal = newTotal
            };
        }
    }
}
