namespace CleanMate_Main.Server.Models.DTO
{
    public class UserWalletDTO
    {
        public int WalletId { get; set; }
        public string UserId { get; set; } = null!;
        public string UserFullName { get; set; } = null!;
        public decimal Balance { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
