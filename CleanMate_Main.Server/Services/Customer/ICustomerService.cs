using CleanMate_Main.Server.Models.DTO;

namespace CleanMate_Main.Server.Services.Customer
{
    public interface ICustomerService
    {
        Task<List<CustomerListItemDTO>> GetCustomerListAsync();
        Task LockUserAccountAsync(string userId);
        Task UnlockUserAccountAsync(string userId);
        Task<CustomerProfileViewModel> GetCustomerProfileAsync(string userId);
        Task<bool> UpdateCustomerProfileAsync(CustomerProfileViewModel profile);
    }
}
