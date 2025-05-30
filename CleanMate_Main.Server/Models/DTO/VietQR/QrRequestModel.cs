namespace CleanMate_Main.Server.Models.DTO.VietQR
{
    public class QrRequestModel
    {
        public string AccountNo { get; set; } = null!;
        public string BankId { get; set; }
        public decimal Amount { get; set; }

    }
}
