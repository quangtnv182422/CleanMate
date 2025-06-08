using CleanMate_Main.Server.Models.ViewModels.Customer;
using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Repository.Employee
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<WorkListViewModel>> FindAllWorkAsync(int? status = null, string? employeeId = null);

        Task<WorkDetailsViewModel> FindWorkByIdAsync(int bookingId);

        Task<IEnumerable<WorkListViewModel>> FindWorkByEmployeeIdAsync(string employeeId);

        Task<bool> ChangeWorkAsync(int bookingId, int status, string? employeeId = null);

        Task<AcceptWorkNotificationViewModel> GetCustomerDetailsAsync(int bookingId);

        Task<int> GetWorkCountByStatusAsync(int status);
        Task UpdateWorkReadStatusAsync(int bookingId, bool isRead);
        Task<IEnumerable<object>> GetBookingStatusesAsync();
        Task<bool> CanCleanerAcceptWorkAsync(int bookingId, string employeeId);
        Task CreateCleanerProfileAsync(string userId);
        Task<IEnumerable<WorkHistoryViewModel>> GetWorkHistoryAsync(string employeeId);
        Task<EarningsSummaryViewModel> GetEarningsSummaryAsync(string employeeId);
        Task<PersonalProfileViewModel> GetPersonalProfileAsync(string employeeId);
        Task<bool> UpdatePersonalProfileAsync(PersonalProfileViewModel profile);
        Task<CustomerReviewSummaryViewModel> GetCustomerReviewsAsync(string employeeId);
        //Task<decimal> GetMonthlyEarningsAsync(string employeeId);

    }
}