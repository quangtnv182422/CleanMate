using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Address;
using CleanMate_Main.Server.Repository.Bookings;
using Microsoft.EntityFrameworkCore;

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
            var listAddress = await _addressRepo.GetAddressInUseByCustomerId(dto.UserId);

            // Tìm địa chỉ trùng GG_PlaceId
            var existing = listAddress?.FirstOrDefault(ad => ad.GG_PlaceId == dto.GG_PlaceId);

            if (existing != null)
            {
                // Cập nhật dữ liệu từ DTO vào địa chỉ cũ
                existing.GG_FormattedAddress = dto.GG_FormattedAddress;
                existing.GG_DispalyName = dto.GG_DispalyName;
                existing.AddressNo = dto.AddressNo;
                existing.IsDefault = dto.IsDefault;
                existing.Latitude = dto.Latitude;
                existing.Longitude = dto.Longitude;


                await _addressRepo.EditAddressAsync(existing);
                return existing;
            }

            // Không trùng thì thêm địa chỉ mới
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

        public async Task<List<CustomerAddressDTO>> GetAddressInUseByCustomerId(string userId)
        {
            var addresses = await _addressRepo.GetAddressInUseByCustomerId(userId);

            var dtoList = addresses
                .Where(x => x != null)
                .Select(address => new CustomerAddressDTO
                {
                    AddressId = address.AddressId,
                    GG_FormattedAddress = address.GG_FormattedAddress,
                    GG_DispalyName = address.GG_DispalyName,
                    GG_PlaceId = address.GG_PlaceId,
                    AddressNo = address.AddressNo,
                    IsInUse = address.IsInUse,
                    IsDefault = address.IsDefault,
                    Latitude = address.Latitude,
                    Longitude = address.Longitude
                })
                .ToList();

            return dtoList;
        }


    }
}
