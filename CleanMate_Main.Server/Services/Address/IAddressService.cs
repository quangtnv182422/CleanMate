using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Address
{
    public interface IAddressService
    {
        Task<CustomerAddress> AddNewAddressAsync(CustomerAddressDTO dto);
        Task<CustomerAddress> EditAddressAsync(CustomerAddressDTO dto);
        Task<List<CustomerAddressDTO?>> GetAddressInUseByCustomerId(string userId);
    }
}
