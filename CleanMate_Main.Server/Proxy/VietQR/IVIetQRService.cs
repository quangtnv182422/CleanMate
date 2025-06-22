namespace CleanMate_Main.Server.Proxy.VietQR
{
    public interface IVIetQRService
    {
        public Task<string> GenerateQRCodeUrl(string bankId, string accountNo, decimal amount, string description);
    }
}
