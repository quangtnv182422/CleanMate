using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Feedbacks
{
    public class FeedbackRepo : IFeedbackRepo
    {
        private readonly CleanMateMainDbContext _context;

        public FeedbackRepo(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<Feedback> GetFeedbackByIdAsync(int feedbackId)
        {
            return await _context.Feedbacks.FindAsync(feedbackId);
        }

        public async Task AddFeedbackAsync(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFeedbackAsync(Feedback feedback)
        {
            _context.Feedbacks.Update(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFeedbackAsync(int feedbackId)
        {
            var feedback = await GetFeedbackByIdAsync(feedbackId);
            if (feedback != null)
            {
                _context.Feedbacks.Remove(feedback);
                await _context.SaveChangesAsync();
            }
        }
    }


}