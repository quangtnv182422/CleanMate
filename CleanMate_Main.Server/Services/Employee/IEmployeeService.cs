using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Services.Employee
{
    public interface IEmployeeService
    {
        Task<IEnumerable<WorkListViewModel>> GetAllWorkAsync(int? status = null, string? employeeId = null);

        Task<WorkDetailsViewModel> GetWorkDetailsAsync(int bookingId);

        Task<IEnumerable<WorkListViewModel>> GetWorkByEmployeeIdAsync(string employeeId);

        Task AcceptWorkRequestAsync(int bookingId, string employeeId);

        Task CancelWorkRequestAsync(int bookingId);

        Task CompleteWorkRequestAsync(int bookingId);

        Task<AcceptWorkNotificationViewModel> GetCustomerInfoAsync(int bookingId);


        Task<WorkSummaryViewModel> GetWorkSummaryAsync();

        Task<bool> ValidateWorkAcceptanceAsync(int bookingId, string employeeId);

        Task CheckWorkReadStatusAsync(int bookingId, bool isRead);
        Task<IEnumerable<object>> GetBookingStatusesAsync();
        Task<bool> CanCleanerAcceptWorkAsync(int bookingId, string employeeId);

    }
}