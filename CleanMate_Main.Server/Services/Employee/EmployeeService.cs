using CleanMate_Main.Server.Models.ViewModels.Employee;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Common;

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

        public async Task AcceptWorkRequestAsync(int bookingId, string employeeId)
        {
            var canAccept = await ValidateWorkAcceptanceAsync(bookingId, employeeId);
            if (!canAccept)
            {
                throw new InvalidOperationException("Cannot accept this work item.");
            }
            await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.ACCEPT, employeeId);
        }

        public async Task CancelWorkRequestAsync(int bookingId)
        {
            await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.CANCEL);
        }

        public async Task CompleteWorkRequestAsync(int bookingId)
        {
            await _employeeRepository.ChangeWorkAsync(bookingId, CommonConstants.BookingStatus.DONE);
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
            return await _employeeRepository.CanCleanerAcceptWorkAsync(bookingId, employeeId);
        }
    }
}