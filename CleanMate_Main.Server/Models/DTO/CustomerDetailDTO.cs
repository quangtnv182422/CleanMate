namespace CleanMate_Main.Server.Models.DTO
{
    public class CustomerDetailDTO
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
        public List<CustomerAddressDTO> Addresses { get; set; }
        public decimal WalletBalance { get; set; }
        public List<WalletTransactionDTO> Transactions { get; set; }
        public List<BookingDTO> Bookings { get; set; }
    }
}
