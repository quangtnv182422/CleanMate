using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Repository.Employee
{
    public interface IEmployeeRepository
    {
        /// <summary>
        /// Retrieves all work items, optionally filtered by status and employee.
        /// </summary>
        /// <param name="status">The status to filter by (e.g., "New", "Pending", "Confirmed")</param>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>A list of WorkListViewModel</returns>
        Task<IEnumerable<WorkListViewModel>> FindAllWorkAsync(string? status = null, string? employeeId = null);

        /// <summary>
        /// Retrieves detailed information for a specific work item by its ID.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>A WorkDetailsViewModel</returns>
        Task<WorkDetailsViewModel> FindWorkByIdAsync(int bookingId);

        /// <summary>
        /// Retrieves all work items assigned to a specific employee.
        /// </summary>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>A list of WorkListViewModel</returns>
        Task<IEnumerable<WorkListViewModel>> FindWorkByEmployeeIdAsync(string employeeId);

        /// <summary>
        /// Updates the status of a specific work item.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <param name="status">The new status</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task UpdateWorkStatusAsync(int bookingId, string status);

        /// <summary>
        /// Assigns a work item to an employee and updates its status.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task AcceptWorkAsync(int bookingId, string employeeId);

        /// <summary>
        /// Marks a work item as canceled by the employee.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task CancelWorkAsync(int bookingId);

        /// <summary>
        /// Marks a work item as completed.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task CompleteWorkAsync(int bookingId);

        /// <summary>
        /// Retrieves customer details associated with a work item.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>An AcceptWorkNotificationViewModel</returns>
        Task<AcceptWorkNotificationViewModel> GetCustomerDetailsAsync(int bookingId);

        /// <summary>
        /// Returns the count of work items for a given status.
        /// </summary>
        /// <param name="status">The status to count (e.g., "New", "Pending", "Confirmed")</param>
        /// <returns>The number of work items</returns>
        Task<int> GetWorkCountByStatusAsync(string status);

        /// <summary>
        /// Updates the "read carefully" status for a work item.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <param name="isRead">The read status</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task UpdateWorkReadStatusAsync(int bookingId, bool isRead);
    }
}
