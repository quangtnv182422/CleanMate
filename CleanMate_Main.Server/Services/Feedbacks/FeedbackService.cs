using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Feedbacks;

namespace CleanMate_Main.Server.Services.Feedbacks
{
    public class FeedbackService : IFeedbackService
    {
        private readonly CleanMateMainDbContext _context;
        private readonly IFeedbackRepo _feedbackRepo;

        public FeedbackService(CleanMateMainDbContext context, IFeedbackRepo feedbackRepo)
        {
            _context = context;
            _feedbackRepo = feedbackRepo;
        }

        public async Task AddFeedbackAsync(int bookingId, string userId, string? cleanerId, double? rating, string? content)
        {
            // Kiểm tra booking có tồn tại không
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null)
            {
                throw new Exception("Booking không tồn tại.");
            }

            // Kiểm tra user có phải là người đặt booking không
            if (booking.UserId != userId)
            {
                throw new Exception("Bạn chỉ có thể để lại feedback cho booking của chính mình.");
            }

            // Nếu có cleanerId, kiểm tra cleaner có phải là người được gán cho booking không
            if (!string.IsNullOrEmpty(cleanerId) && booking.CleanerId != cleanerId)
            {
                throw new Exception("Cleaner này không được gán cho booking.");
            }

            // Kiểm tra rating hợp lệ (giả sử từ 1 đến 5)
            if (rating.HasValue && (rating < 1 || rating > 5))
            {
                throw new Exception("Rating phải từ 1 đến 5.");
            }

            // Tạo feedback mới
            var feedback = new Feedback
            {
                BookingId = bookingId,
                UserId = userId,
                CleanerId = cleanerId,
                Rating = rating,
                Content = content,
                CreatedAt = DateTimeVN.GetNow(),
                UpdatedAt = DateTimeVN.GetNow()
            };

            await _feedbackRepo.AddFeedbackAsync(feedback);
        }

        public async Task UpdateFeedbackAsync(int feedbackId, string userId, double? rating, string? content)
        {
            var feedback = await _feedbackRepo.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new Exception("Feedback không tồn tại.");
            }

            // Kiểm tra quyền sở hữu
            if (feedback.UserId != userId)
            {
                throw new Exception("Bạn chỉ có thể cập nhật feedback của chính mình.");
            }

            // Kiểm tra rating hợp lệ
            if (rating.HasValue && (rating < 1 || rating > 5))
            {
                throw new Exception("Rating phải từ 1 đến 5.");
            }

            // Cập nhật thông tin
            if (rating.HasValue) feedback.Rating = rating;
            if (!string.IsNullOrEmpty(content)) feedback.Content = content;
            feedback.UpdatedAt = DateTimeVN.GetNow();

            await _feedbackRepo.UpdateFeedbackAsync(feedback);
        }

        public async Task DeleteFeedbackAsync(int feedbackId, string userId)
        {
            var feedback = await _feedbackRepo.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new Exception("Feedback không tồn tại.");
            }

            // Kiểm tra quyền sở hữu
            if (feedback.UserId != userId)
            {
                throw new Exception("Bạn chỉ có thể xóa feedback của chính mình.");
            }

            await _feedbackRepo.DeleteFeedbackAsync(feedbackId);
        }
    }
}