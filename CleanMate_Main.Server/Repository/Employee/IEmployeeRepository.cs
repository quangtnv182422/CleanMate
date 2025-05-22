using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Repository.Employee
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<WorkListViewModel>> FindAllWorkAsync(int? status = null, string? employeeId = null);

        Task<WorkDetailsViewModel> FindWorkByIdAsync(int bookingId);


        Task<IEnumerable<WorkListViewModel>> FindWorkByEmployeeIdAsync(string employeeId);

        Task ChangeWorkAsync(int bookingId, int status, string? employeeId = null);

        Task<AcceptWorkNotificationViewModel> GetCustomerDetailsAsync(int bookingId);

        Task<int> GetWorkCountByStatusAsync(int status);

        Task UpdateWorkReadStatusAsync(int bookingId, bool isRead);
    }
}