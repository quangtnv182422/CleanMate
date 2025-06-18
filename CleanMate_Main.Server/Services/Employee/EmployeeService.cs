using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.ViewModels.Customer;
using CleanMate_Main.Server.Models.ViewModels.Employee;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Repository.Wallet;
using CleanMate_Main.Server.Services.Wallet;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CleanMate_Main.Server.Services.Employee
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IUserWalletRepo _userWalletRepo;
        private readonly IBookingRepository _bookingRepository;
        private readonly IUserWalletService _userWalletService;



        public EmployeeService(IEmployeeRepository employeeRepository, IUserWalletRepo userWalletRepo, IBookingRepository bookingRepository, IUserWalletService userWalletService)
        {
            _employeeRepository = employeeRepository ?? throw new ArgumentNullException(nameof(employeeRepository));
            _userWalletRepo = userWalletRepo ?? throw new ArgumentNullException(nameof(_userWalletRepo));
            _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
            _userWalletService = userWalletService ?? throw new ArgumentNullException(nameof(userWalletService));
        }

        public async Task<IEnumerable<WorkListViewModel>> GetAllWorkAsync(int? status = null, string? employeeId = null)
        {
            return await _employeeRepository.FindAllWorkAsync(status, employeeId);
        }

        public async Task<WorkDetailsViewModel> GetWorkDetailsAsync(int bookingId)
        {
            return await _employeeRepository.FindWorkByIdAsync(bookingId);
        }

        public async Task<IEnumerable<WorkListViewModel>> GetWorkByEmployeeIdAsync(string employeeId)
        {
            return await _employeeRepository.FindWorkByEmployeeIdAsync(employeeId);
        }

        public async Task<bool> AcceptWorkRequestAsync(int bookingId, string employeeId)
        {
            var wallet = await _userWalletRepo.GetWalletByUserIdAsync(employeeId);
            var booking = await _bookingRepository.GetBookingByIdAsync(bookingId);

            if (booking == null)
            {
                throw new KeyNotFoundException("Công việc không tồn tại.");
            }

            DateTime startTime = booking.Date.ToDateTime(booking.StartTime); 
            DateTime currentTime = DateTimeVN.GetNow();

            if (startTime < currentTime)
            {
                throw new KeyNotFoundException("Công việc đã quá thời hạn để nhận.");
            }

            if (wallet == null || wallet.Balance < CommonConstants.MINIMUM_COINS_TO_ACCEPT_WORK) 
            {
                throw new InvalidOperationException($"Số dư ví không đủ. Bạn cần tối thiểu {CommonConstants.MINIMUM_COINS_TO_ACCEPT_WORK.ToString("N0")} coins để nhận công việc.");
            }

            var isValid = await ValidateWorkAcceptanceAsync(bookingId, employeeId);
            if (!isValid)
            {
                throw new InvalidOperationException("Không thể nhận công việc này. Công việc có thể đã bị hủy hoặc đã được người khác nhận.");
            }

            var canAccept = await _employeeRepository.CanCleanerAcceptWorkAsync(bookingId, employeeId);
            if (!canAccept)
            {
                throw new InvalidOperationException("Không thể nhận công việc này do trùng thời gian với công việc khác.");
            }

            return await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.ACCEPT, employeeId);
        }

        public async Task<bool> BeginWorkRequestAsync(int bookingId, string employeeId)
        {
            var booking = await _employeeRepository.FindWorkByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Công việc không tồn tại.");
            }

            if (booking.EmployeeId != employeeId)
            {
                throw new InvalidOperationException("Bạn không có quyền bắt đầu công việc này.");
            }

            if (booking.StatusId != CommonConstants.BookingStatus.ACCEPT)
            {
                throw new InvalidOperationException("Công việc phải ở trạng thái Đã nhận để bắt đầu.");
            }

            return await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.IN_PROGRESS, employeeId);
        }

        public async Task<bool> CompleteWorkRequestAsync(int bookingId, string employeeId)
        {
            var booking = await _employeeRepository.FindWorkByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Công việc không tồn tại.");
            }

            if (booking.EmployeeId != employeeId)
            {
                throw new InvalidOperationException("Bạn không có quyền hoàn thành công việc này.");
            }
            if (booking.StatusId != CommonConstants.BookingStatus.IN_PROGRESS)
            {
                throw new InvalidOperationException("Công việc phải ở trạng thái Đang thực hiện để hoàn thành.");
            }

            return await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.PENDING_DONE, employeeId);
        }

        public async Task<bool> CancelWorkRequestAsync(int bookingId, string employeeId)
        {
            var booking = await _bookingRepository.GetBookingByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Công việc không tồn tại.");
            }
            if (booking.CleanerId != employeeId)
            {
                throw new InvalidOperationException("Bạn không có quyền hủy công việc này.");
            }

            if (booking.BookingStatusId != CommonConstants.BookingStatus.ACCEPT)
            {
                throw new InvalidOperationException("Chỉ có thể hủy công việc khi trạng thái là Đã nhận.");
            }

            DateTime currentTime = DateTimeVN.GetNow();
            DateTime startTime = booking.Date.ToDateTime(booking.StartTime);
            TimeSpan timeDifference = startTime - currentTime;

            decimal refundAmount = 0m;
            decimal refundPercentage = 0m;
            int newStatus = CommonConstants.BookingStatus.CANCEL; 
            if (timeDifference.TotalHours >= 8)
            {
                refundAmount = booking.TotalPrice.Value * (1.0m -CommonConstants.COMMISSION_PERCENTAGE);
                refundPercentage = 1.0m;  // 100%
                newStatus = CommonConstants.BookingStatus.NEW; // Set to NEW for >= 8 hours
                employeeId = null;
            }
            else if (timeDifference.TotalHours >= 5)
            {
                refundAmount = 0m;
                refundPercentage = 0.8m; // 80%
                newStatus = CommonConstants.BookingStatus.NEW; // Set to NEW for >= 5 hours
                employeeId = null;

            }
            else if (timeDifference.TotalHours >= 1)
            {
                refundPercentage = 0.5m; // 50%
                refundAmount = -(booking.TotalPrice.Value * (0.5m - (1.0m - CommonConstants.COMMISSION_PERCENTAGE)));
                newStatus = CommonConstants.BookingStatus.NEW; // Set to NEW for >= 1 hours
                employeeId = null;
            }
            else
            {
                refundPercentage = 0.0m; // 0%
                refundAmount = - (booking.TotalPrice.Value * CommonConstants.COMMISSION_PERCENTAGE); // No refund for less than 1 hour
            }

                string refundReason = $"Hoàn tiền hủy công việc (mức hoàn: {refundPercentage * 100}%)";

            if (refundAmount < 0)
            {
                try
                {
                    // Refund by deducting a negative amount (effectively adding to the wallet)
                    await _userWalletService.DeductMoneyAsync(booking.CleanerId, -refundAmount, refundReason, bookingId);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException($"Không thể hoàn tiền: {ex.Message}");
                }
            }
            else if (refundAmount > 0)
            {
                try
                {
                    // Refund by adding to the wallet
                    await _userWalletService.AddMoneyAsync(booking.CleanerId, refundAmount, refundReason, bookingId);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException($"Không thể hoàn tiền: {ex.Message}");
                }
            }


            return await _employeeRepository.ChangeWorkAsync(bookingId, newStatus, employeeId);
        }

        public async Task<bool> ConfirmDoneWorkRequestAsync(int bookingId)
        {
            var booking = await _employeeRepository.FindWorkByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Công việc không tồn tại.");
            }

            // Kiểm tra quyền: chỉ khách hàng (UserId) hoặc admin có thể xác nhận
           /* if (booking.UserId != userId && !await IsAdminAsync(userId))
            {
                throw new InvalidOperationException("Bạn không có quyền xác nhận hoàn thành công việc này.");
            }*/

            if (booking.StatusId != CommonConstants.BookingStatus.PENDING_DONE)
            {
                throw new InvalidOperationException("Công việc phải ở trạng thái Chờ xác nhận để có thể xác nhận hoàn thành.");
            }

            return await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.DONE);
        }

        public async Task<AcceptWorkNotificationViewModel> GetCustomerInfoAsync(int bookingId)
        {
            return await _employeeRepository.GetCustomerDetailsAsync(bookingId);
        }


        public async Task<WorkSummaryViewModel> GetWorkSummaryAsync()
        {
            var newCount = await _employeeRepository.GetWorkCountByStatusAsync(CommonConstants.BookingStatus.NEW);
            var pendingCount = await _employeeRepository.GetWorkCountByStatusAsync(CommonConstants.BookingStatus.PENDING_DONE);
            var confirmedCount = await _employeeRepository.GetWorkCountByStatusAsync(CommonConstants.BookingStatus.ACCEPT);

            return new WorkSummaryViewModel
            {
                NewWorkCount = newCount,
                PendingWorkCount = pendingCount,
                ConfirmedWorkCount = confirmedCount
            };
        }

        public async Task<bool> ValidateWorkAcceptanceAsync(int bookingId, string employeeId)
        {
            var workDetails = await _employeeRepository.FindWorkByIdAsync(bookingId);
            if (workDetails == null || workDetails.Status != CommonConstants.GetStatusString(CommonConstants.BookingStatus.NEW))
            {
                return false;
            }
            return true;
        }

        public async Task CheckWorkReadStatusAsync(int bookingId, bool isRead)
        {
            await _employeeRepository.UpdateWorkReadStatusAsync(bookingId, isRead);
        }
        public async Task<IEnumerable<object>> GetBookingStatusesAsync()
        {
            return await _employeeRepository.GetBookingStatusesAsync();
        }
        public async Task<bool> CanCleanerAcceptWorkAsync(int bookingId, string employeeId)
        {
            if (!await ValidateWorkAcceptanceAsync(bookingId, employeeId))
            {
                return false;
            }
            return await _employeeRepository.CanCleanerAcceptWorkAsync(bookingId, employeeId);
        }
        public async Task CreateCleanerProfileAsync(string userId)
        {
            await _employeeRepository.CreateCleanerProfileAsync(userId);
        }

        public async Task<IEnumerable<WorkHistoryViewModel>> GetWorkHistoryAsync(string employeeId)
        {
            return await _employeeRepository.GetWorkHistoryAsync(employeeId);
        }

        public async Task<EarningsSummaryViewModel> GetEarningsSummaryAsync(string employeeId)
        {
            return await _employeeRepository.GetEarningsSummaryAsync(employeeId);
        }

        public async Task<PersonalProfileViewModel> GetPersonalProfileAsync(string employeeId)
        {
            return await _employeeRepository.GetPersonalProfileAsync(employeeId);
        }

        public async Task<bool> UpdatePersonalProfileAsync(PersonalProfileViewModel profile)
        {
            if (string.IsNullOrEmpty(profile.UserId))
            {
                throw new ArgumentException("UserId không được để trống.");
            }
            var success = await _employeeRepository.UpdatePersonalProfileAsync(profile);
            if (!success)
            {
                throw new InvalidOperationException("Cập nhật hồ sơ thất bại.");
            }
            return true;
        }

        public async Task<CustomerReviewSummaryViewModel> GetCustomerReviewsAsync(string employeeId)
        {
            return await _employeeRepository.GetCustomerReviewsAsync(employeeId);
        }
        public async Task<decimal> GetMonthlyEarningsAsync(string employeeId)
        {
            return await _employeeRepository.GetMonthlyEarningsAsync(employeeId);
        }
        public async Task<IEnumerable<MonthlyEarningViewModel>> GetEarningsByMonthAsync(string employeeId)
        {
            return await _employeeRepository.GetEarningsByMonthAsync(employeeId);
        }

        public async Task<List<CleanerDTO>> GetAvailableCleanersAsync()
        {
            return await _employeeRepository.GetAvailableCleanersAsync();
        }

        public async Task<IEnumerable<FeedbackHistoryViewModel>> GetFeedbackHistoryAsync(string employeeId)
        {
            return await _employeeRepository.GetFeedbackHistoryAsync(employeeId);
        }

        public async Task<bool> RecalculateCleanerRatingAsync(string employeeId, int newRating)
        {
            var cleanerProfile = await _employeeRepository.GetPersonalProfileAsync(employeeId);
            if (cleanerProfile == null)
            {
                throw new KeyNotFoundException("Hồ sơ người dọn dẹp không tồn tại.");
            }

            var feedbackCount = await _employeeRepository.CountFeedbackDone(employeeId);

            var averageRating = cleanerProfile.AverageRating ?? 0;

            var newAverage = (averageRating * feedbackCount + newRating) / (feedbackCount + 1);
            cleanerProfile.AverageRating = newAverage;

            return await _employeeRepository.UpdatePersonalProfileAsync(cleanerProfile);
        }
    }
}
