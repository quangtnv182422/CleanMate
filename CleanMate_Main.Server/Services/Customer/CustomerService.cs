using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Repository.Customer;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Services.Customer
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repository;

        public CustomerService(ICustomerRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<CustomerListItemDTO>> GetCustomerListAsync(string search)
        {
            return await _repository.GetCustomerListAsync(search);
        }

        public async Task LockUserAccountAsync(string userId)
        {
            await _repository.LockUserAccountAsync(userId);
        }

        public async Task UnlockUserAccountAsync(string userId)
        {
            await _repository.UnlockUserAccountAsync(userId);
        }
    }
}
