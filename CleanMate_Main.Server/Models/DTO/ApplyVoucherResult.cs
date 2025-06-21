namespace CleanMate_Main.Server.Models.DTO
{
    public class ApplyVoucherResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal NewTotal { get; set; }
    }
}
