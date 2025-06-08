using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Feedbacks
{
    public interface IFeedbackRepo
    {
        Task<Feedback> GetFeedbackByIdAsync(int feedbackId);
        Task AddFeedbackAsync(Feedback feedback);
        Task UpdateFeedbackAsync(Feedback feedback);
        Task DeleteFeedbackAsync(int feedbackId);
    }
}
