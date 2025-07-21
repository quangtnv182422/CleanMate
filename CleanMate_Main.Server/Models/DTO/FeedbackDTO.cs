using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Models.DTO
{
    public class FeedbackDTO
    {
        public int FeedbackId { get; set; }

        public int BookingId { get; set; }

        public string? CleanerId { get; set; }

        public double? Rating { get; set; }

        public string? Content { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
