namespace CleanMate_Main.Server.Models.DTO
{
    public class AddFeedbackDTO
    {
        public int BookingId { get; set; }
        public string? CleanerId { get; set; }
        public double? Rating { get; set; }
        public string? Content { get; set; }
    }
}
