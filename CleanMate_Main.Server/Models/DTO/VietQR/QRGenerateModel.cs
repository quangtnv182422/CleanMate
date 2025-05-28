namespace CleanMate_Main.Server.Models.DTO.VietQR
{
    public class QRGenerateModel
    {
        public string AccountNo { get; set; } = null!;
        public string AccountName { get; set; } = null!;
        public int AcqId { get; set; }
        public int Amount { get; set; }
        public string? AddInfo { get; set; }
        public string Template { get; set; } = "print";
    }
}
