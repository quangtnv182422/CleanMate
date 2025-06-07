namespace CleanMate_Main.Server.Models.DTO
{
    public class BookingDTO { 
        public int BookingId { get; set; } 
        public int ServicePriceId { get; set; } 
        public string ServiceName { get; set; }
        public int DurationTime { get; set; }
        public string DurationSquareMeter { get; set; }
        public decimal Price { get; set; }
        public string CleanerId { get; set; } 
        public string CleanerName { get; set; } 
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int BookingStatusId { get; set; } 
        public string Status { get; set; }
        public string StatusDescription { get; set; } 
        public string Note { get; set; } 
        public int? AddressId { get; set; }
        public string AddressFormatted { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public decimal? TotalPrice { get; set; }
        public DateTime? CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } }
}
