using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Address
{
    public interface IAddressRepository
    {
        Task<CustomerAddress> AddAddressAsync(CustomerAddress address);
        Task<CustomerAddress?> EditAddressAsync(CustomerAddress address);
        Task<List<CustomerAddress?>> GetAddressInUseByCustomerId(string userId);
        Task<CustomerAddress?> GetAddressByAddressId(int addressId);
    }
}
