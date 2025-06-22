using CleanMate_Main.Server.Models.Enum;

namespace CleanMate_Main.Server.Models.DTO
{
    public class VoucherDTO
    {
        public int VoucherId { get; set; }
        public string? Description { get; set; }
        public decimal DiscountPercentage { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateOnly ExpireDate { get; set; }
        public string? VoucherCode { get; set; }
        public bool IsEventVoucher { get; set; }
        public string? CreatedBy { get; set; }
        public VoucherStatus Status { get; set; }
    }
}
