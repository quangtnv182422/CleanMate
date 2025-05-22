using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Models.DTO
{
    public class ServicePriceDTO
    {
        public int PriceId { get; set; }
        public decimal Price { get; set; }

        public int DurationId { get; set; }
        public string SquareMeterSpecific { get; set; }
        public int DurationTime { get; set; }


        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
    }
}
