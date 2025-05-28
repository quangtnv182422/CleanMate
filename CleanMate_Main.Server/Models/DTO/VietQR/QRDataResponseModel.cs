namespace CleanMate_Main.Server.Models.DTO.VietQR
{
    public class QRDataResponseModel
    {
        public string Code { get; set; } = null!;
        public string Desc { get; set; } = null!;
        public QRData Data { get; set; } = null!;
    }

    public class QRData
    {
        public int AcpId { get; set; }
        public string AccountName { get; set; } = null!;
        public string QrCode { get; set; } = null!;
        public string QrDataURL { get; set; } = null!;
    }
}
