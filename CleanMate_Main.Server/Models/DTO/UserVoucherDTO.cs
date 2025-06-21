namespace CleanMate_Main.Server.Models.DTO
{
    public class UserVoucherDTO
    {
        public int UserVoucherId { get; set; }
        public int VoucherId { get; set; }
        public string VoucherCode { get; set; }
        public string Description { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateOnly? ExpireDate { get; set; }
    }
}
