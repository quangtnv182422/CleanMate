using CleanMate_Main.Server.Models.Enum;

namespace CleanMate_Main.Server.Models.DTO
{
    public class PaymentDTO
    {
        public int? PaymentId { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public PaymentType PaymentMethod { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public string? TransactionId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
