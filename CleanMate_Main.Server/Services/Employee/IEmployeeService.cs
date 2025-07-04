﻿using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.ViewModels.Customer;
using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Services.Employee
{
    public interface IEmployeeService
    {
        Task<IEnumerable<WorkListViewModel>> GetAllWorkAsync(int? status = null, string? employeeId = null);

        Task<WorkDetailsViewModel> GetWorkDetailsAsync(int bookingId);

        Task<IEnumerable<WorkListViewModel>> GetWorkByEmployeeIdAsync(string employeeId);

        Task<bool> AcceptWorkRequestAsync(int bookingId, string employeeId);

        Task<bool> CancelWorkRequestAsync(int bookingId, string employeeId);
        Task<bool> BeginWorkRequestAsync(int bookingId, string employeeId);

        Task<bool> CompleteWorkRequestAsync(int bookingId, string employeeId);
        Task<bool> ConfirmDoneWorkRequestAsync(int bookingId);
        Task<AcceptWorkNotificationViewModel> GetCustomerInfoAsync(int bookingId);


        Task<WorkSummaryViewModel> GetWorkSummaryAsync();

        Task<bool> ValidateWorkAcceptanceAsync(int bookingId, string employeeId);

        Task CheckWorkReadStatusAsync(int bookingId, bool isRead);
        Task<IEnumerable<object>> GetBookingStatusesAsync();
        Task<bool> CanCleanerAcceptWorkAsync(int bookingId, string employeeId);
        Task CreateCleanerProfileAsync(string userId);
        Task<IEnumerable<WorkHistoryViewModel>> GetWorkHistoryAsync(string employeeId);
        Task<EarningsSummaryViewModel> GetEarningsSummaryAsync(string employeeId);
        Task<PersonalProfileViewModel> GetPersonalProfileAsync(string employeeId);
        Task<bool> UpdatePersonalProfileAsync(PersonalProfileViewModel profile);
        Task<CustomerReviewSummaryViewModel> GetCustomerReviewsAsync(string employeeId);
        Task<decimal> GetMonthlyEarningsAsync(string employeeId);
        Task<IEnumerable<MonthlyEarningViewModel>> GetEarningsByMonthAsync(string employeeId);
        Task<List<CleanerDTO>> GetAvailableCleanersAsync();
        Task<IEnumerable<FeedbackHistoryViewModel>> GetFeedbackHistoryAsync(string employeeId);
        Task<bool> RecalculateCleanerRatingAsync(string employeeId, int newRating);

        Task<List<CleanerListItemDTO>> GetCleanerListAsync();
        Task<CleanerDetailDTO> GetCleanerDetailAsync(int cleanerId);
        Task ToggleCleanerAvailabilityAsync(int cleanerId, bool isAvailable);
    }
}