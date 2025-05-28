namespace CleanMate_Main.Server.Models.DTO.vnPay
{
    public class PaymentInformationModel
    {
        public string OrderType { get; set; }
        public double Amount { get; set; }
        public string OrderDescription { get; set; }
        public string Name { get; set; }
        public string TypeTransaction { get; set; }
        public string UserId { get; set; }
        public int BookingId { get; set; }

    }
}
