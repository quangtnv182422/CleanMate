namespace CleanMate_Main.Server.Proxy.VietQR
{
    public interface IVIetQRService
    {
         Task<string> GenerateQRCodeAsync(string accountNo, string accountName, int acqId, decimal amount, string addInfo, string template = "compact");
    }
}
