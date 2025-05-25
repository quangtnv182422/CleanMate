using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Address;
using CleanMate_Main.Server.Repository.Bookings;

namespace CleanMate_Main.Server.Services.Address
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepo;

        public AddressService(IAddressRepository addressRepo)
        {
            _addressRepo = addressRepo;
        }

        public async Task<CustomerAddress> AddNewAddressAsync(CustomerAddressDTO dto)
        {
            var address = new CustomerAddress
            {
                UserId = dto.UserId,
                GG_FormattedAddress = dto.GG_FormattedAddress,
                GG_DispalyName = dto.GG_DispalyName,
                GG_PlaceId = dto.GG_PlaceId,
                AddressNo = dto.AddressNo,
                IsInUse = true,
                IsDefault = dto.IsDefault,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude
            };
            return await _addressRepo.AddAddressAsync(address);
        }

        public async Task<CustomerAddress> EditAddressAsync(CustomerAddressDTO dto)
        {
            var oldAddress = await _addressRepo.GetAddressByAddressId(dto.AddressId);
            if (oldAddress != null)
            {
                oldAddress.IsInUse = false;
                await _addressRepo.EditAddressAsync(oldAddress);
            }

            var newAddress = new CustomerAddress
            {
                UserId = dto.UserId,
                GG_FormattedAddress = dto.GG_FormattedAddress,
                GG_DispalyName = dto.GG_DispalyName,
                GG_PlaceId = dto.GG_PlaceId,
                AddressNo = dto.AddressNo,
                IsInUse = true,
                IsDefault = dto.IsDefault,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude
            };

            return await _addressRepo.AddAddressAsync(newAddress);
        }



    }
}
