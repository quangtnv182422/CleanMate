namespace CleanMate_Main.Server.Models.DTO
{
    public class CleanerDetailDTO
    {
        public int CleanerId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Area { get; set; }
        public bool? Available { get; set; }
        public int? ExperienceYear { get; set; }
        public decimal WalletBalance { get; set; }
        public List<WalletTransactionDTO> Transactions { get; set; }
        public List<BookingDTO> Bookings { get; set; }
    }
}
