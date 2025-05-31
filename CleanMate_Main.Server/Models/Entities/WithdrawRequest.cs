using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CleanMate_Main.Server.Models.Entities
{
    public enum WithdrawStatus
    {
        Pending,
        Approved,
        Rejected
    }

    public class WithdrawRequest
    {
        [Key]
        public int RequestId { get; set; }

        [Required]
        [MaxLength(450)]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public virtual AspNetUser User { get; set; } = null!;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public WithdrawStatus Status { get; set; } = WithdrawStatus.Pending;

        [Required]
        public DateTime RequestedAt { get; set; } = DateTime.Now;

        public DateTime? ProcessedAt { get; set; }

        public string? AdminNote { get; set; }

        public int? TransactionId { get; set; }

        [ForeignKey(nameof(TransactionId))]
        public virtual WalletTransaction? Transaction { get; set; }

        [MaxLength(450)]
        public string? ProcessedBy { get; set; }

        [ForeignKey(nameof(ProcessedBy))]
        public virtual AspNetUser? Admin { get; set; }
    }
}
