using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Services.Customer
{
    public interface ICustomerService
    {
        Task<CustomerProfileViewModel> GetCustomerProfileAsync(string userId);
        Task<bool> UpdateCustomerProfileAsync(CustomerProfileViewModel profile);
    }
}
