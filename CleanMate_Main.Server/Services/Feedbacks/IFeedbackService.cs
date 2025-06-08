namespace CleanMate_Main.Server.Services.Feedbacks
{
    public interface IFeedbackService
    {
        Task AddFeedbackAsync(int bookingId, string userId, string? cleanerId, double? rating, string? content);
        Task UpdateFeedbackAsync(int feedbackId, string userId, double? rating, string? content);
        Task DeleteFeedbackAsync(int feedbackId, string userId);
    }
}
