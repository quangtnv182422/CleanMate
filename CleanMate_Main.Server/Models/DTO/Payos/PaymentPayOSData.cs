namespace CleanMate_Main.Server.Models.DTO.Payos
{
    public class PaymentPayOSData
    {
        public int? orderCode { get; set; }
        public int amount { get; set; }
        public string? description { get; set; }
        public string? typeTransaction { get; set; }
        public string? userId { get; set; } // tạm thời truyền từ client
        public List<ItemData>? items { get; set; }
        public string? returnUrl { get; set; }
        public string? cancelUrl { get; set; }
    }

    public record ItemData(string name, int quantity, int price);
}
