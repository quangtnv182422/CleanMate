using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using CleanMate_Main.Server.Models.Enum;

namespace CleanMate_Main.Server.Models.Entities
{
    [Table("Wallet_Transaction")]
    public class WalletTransaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public int WalletId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(50)]
        public TransactionType TransactionType { get; set; } 

        [MaxLength(255)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int? RelatedBookingId { get; set; }

        public virtual UserWallet Wallet { get; set; } = null!;
        public virtual Booking? Booking { get; set; } = null!;
    }
}
