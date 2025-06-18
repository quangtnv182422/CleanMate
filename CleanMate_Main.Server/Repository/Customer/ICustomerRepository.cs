using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Customer
{
    public interface ICustomerRepository
    {
        Task<List<CustomerListItemDTO>> GetCustomerListAsync();
        Task LockUserAccountAsync(string userId);
        Task UnlockUserAccountAsync(string userId);
        Task<AspNetUser> GetUserById(string userId);
    }
}
