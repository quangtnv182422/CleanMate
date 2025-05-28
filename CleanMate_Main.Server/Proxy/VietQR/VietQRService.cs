using CleanMate_Main.Server.Models.DTO.VietQR;
using System.Text;
using System.Text.Json;

namespace CleanMate_Main.Server.Proxy.VietQR
{
    public class VietQRService : IVIetQRService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly string _clientId;
        private readonly string _apiKey;

        public VietQRService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _clientId = _configuration["VietQR:ClientId"] ?? throw new ArgumentNullException("VietQR:ClientId is not configured.");
            _apiKey = _configuration["VietQR:ApiKey"] ?? throw new ArgumentNullException("VietQR:ApiKey is not configured.");
        }
        public async Task<string> GenerateQRCodeAsync(string accountNo, string accountName, int acqId, decimal amount, string addInfo, string template = "compact")
        {
            if (string.IsNullOrEmpty(accountNo) || accountNo.Length < 6 || accountNo.Length > 19)
            {
                throw new ArgumentException("Số tài khoản phải từ 6 đến 19 ký tự.");
            }
            if (string.IsNullOrEmpty(accountName) || accountName.Length < 5 || accountName.Length > 50)
            {
                throw new ArgumentException("Tên tài khoản phải từ 5 đến 50 ký tự.");
            }
            if (amount <= 0 || amount.ToString().Length > 13)
            {
                throw new ArgumentException("Số tiền phải lớn hơn 0 và không vượt quá 13 ký tự.");
            }
            if (!string.IsNullOrEmpty(addInfo) && addInfo.Length > 25)
            {
                addInfo = addInfo.Substring(0, 25); // Truncate to 25 chars
            }

            var requestBody = new QRGenerateModel
            {
                AccountNo = accountNo,
                AccountName = accountName,
                AcqId = acqId,
                Amount = (int)amount, // Convert to integer as per API requirement
                AddInfo = addInfo,
                Template = template
            };

            using var client = _httpClientFactory.CreateClient();
            var requestContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            client.DefaultRequestHeaders.Add("x-client-id", _clientId);
            client.DefaultRequestHeaders.Add("x-api-key", _apiKey);

            var response = await client.PostAsync("https://api.vietqr.io/v2/generate", requestContent);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var qrResponse = JsonSerializer.Deserialize<QRDataResponseModel>(responseContent);

            if (qrResponse == null || qrResponse.Code != "00")
            {
                throw new InvalidOperationException($"Lỗi tạo mã QR: {qrResponse?.Desc ?? "Không có phản hồi từ VietQR."}");
            }

            return qrResponse.Data.QrDataURL;
        }
    }
}

