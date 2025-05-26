using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CleanMate_Main.Server.Models.Entities
{
    [Table("User_Wallet")]
    public class UserWallet
    {
        [Key]
        public int WalletId { get; set; }

        [Required]
        [MaxLength(450)]
        public string UserId { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = 0;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public virtual AspNetUser User { get; set; } = null!;

        public virtual ICollection<WalletTransaction> Transactions { get; set; } = new List<WalletTransaction>();
    }
}
