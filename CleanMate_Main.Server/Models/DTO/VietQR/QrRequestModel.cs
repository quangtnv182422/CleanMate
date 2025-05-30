namespace CleanMate_Main.Server.Models.DTO.VietQR
{
    public class QrRequestModel
    {
        public string AccountNo { get; set; } = null!;
        public int BankId { get; set; }
        public int Amount { get; set; }

    }
}
