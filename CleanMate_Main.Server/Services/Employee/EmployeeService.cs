using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.ViewModels.Customer;
using CleanMate_Main.Server.Models.ViewModels.Employee;
using CleanMate_Main.Server.Repository.Employee;

namespace CleanMate_Main.Server.Services.Employee
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository ?? throw new ArgumentNullException(nameof(employeeRepository));
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
            var booking = await _employeeRepository.FindWorkByIdAsync(bookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException("Công việc không tồn tại.");
            }
            if (booking.EmployeeId != employeeId)
            {
                throw new InvalidOperationException("Bạn không có quyền hủy công việc này.");
            }

            if (booking.StatusId != CommonConstants.BookingStatus.ACCEPT)
            {
                throw new InvalidOperationException("Chỉ có thể hủy công việc khi trạng thái là Đã nhận.");
            }

            return await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.CANCEL, employeeId);
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
    }
}
