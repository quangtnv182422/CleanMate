using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Services.Employee
{
    public interface IEmployeeService
    {
        /// <summary>
        /// Retrieves all work items for the employee, optionally filtered by status.
        /// </summary>
        /// <param name="status">The status to filter by (e.g., "New", "Pending", "Confirmed")</param>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>A list of WorkListViewModel</returns>
        Task<IEnumerable<WorkListViewModel>> GetAllWorkAsync(string? status = null, string? employeeId = null);

        /// <summary>
        /// Retrieves detailed information for a specific work item.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>A WorkDetailsViewModel</returns>
        Task<WorkDetailsViewModel> GetWorkDetailsAsync(int bookingId);

        /// <summary>
        /// Retrieves all work items assigned to a specific employee.
        /// </summary>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>A list of WorkListViewModel</returns>
        Task<IEnumerable<WorkListViewModel>> GetWorkByEmployeeIdAsync(string employeeId);

        /// <summary>
        /// Processes the acceptance of a work item by an employee.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task AcceptWorkRequestAsync(int bookingId, string employeeId);

        /// <summary>
        /// Processes the cancellation of a work item by an employee.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task CancelWorkRequestAsync(int bookingId);

        /// <summary>
        /// Marks a work item as completed.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task CompleteWorkRequestAsync(int bookingId);

        /// <summary>
        /// Retrieves customer details for a work item.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <returns>An AcceptWorkNotificationViewModel</returns>
        Task<AcceptWorkNotificationViewModel> GetCustomerInfoAsync(int bookingId);

        /// <summary>
        /// Generates a Google Maps link for a given address.
        /// </summary>
        /// <param name="address">The address of the booking</param>
        /// <returns>The Google Maps URL</returns>
        string GenerateGoogleMapsLink(string address);

        /// <summary>
        /// Retrieves a summary of work items by status.
        /// </summary>
        /// <returns>A WorkSummaryViewModel</returns>
        Task<WorkSummaryViewModel> GetWorkSummaryAsync();

        /// <summary>
        /// Validates if a work item can be accepted by an employee.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <param name="employeeId">The ID of the employee</param>
        /// <returns>True if the work can be accepted, false otherwise</returns>
        Task<bool> ValidateWorkAcceptanceAsync(int bookingId, string employeeId);

        /// <summary>
        /// Updates the "read carefully" status for a work item.
        /// </summary>
        /// <param name="bookingId">The ID of the booking</param>
        /// <param name="isRead">The read status</param>
        /// <returns>Task representing the asynchronous operation</returns>
        Task CheckWorkReadStatusAsync(int bookingId, bool isRead);
    }
}
