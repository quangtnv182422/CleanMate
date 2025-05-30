namespace CleanMate_Main.Server.Proxy.VietQR
{
    public interface IVIetQRService
    {
        public string GenerateQRCodeUrl(string bankId, string accountNo, decimal amount);
    }
}
