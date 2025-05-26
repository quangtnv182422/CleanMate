using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Address
{
    public class AddressRepository : IAddressRepository
    {
        private readonly CleanMateMainDbContext _context;

        public AddressRepository(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<CustomerAddress> AddAddressAsync(CustomerAddress address)
        {
            await _context.CustomerAddresses.AddAsync(address);
            await _context.SaveChangesAsync();

            return address;
        }

        public async Task<CustomerAddress?> EditAddressAsync(CustomerAddress address)
        {
            var existingAddress = await _context.CustomerAddresses
                .FirstOrDefaultAsync(x => x.AddressId == address.AddressId);

            if (existingAddress == null)
                return null;

            _context.Entry(existingAddress).CurrentValues.SetValues(address);
            await _context.SaveChangesAsync();

            return existingAddress;
        }


        public async Task<List<CustomerAddress?>> GetAddressInUseByCustomerId(string userId)
        {
            var customerAddress = await _context.CustomerAddresses
                                                .Where(x => x.UserId == userId && x.IsInUse == true)
                                                .ToListAsync();

            return customerAddress;
        }

        public async Task<CustomerAddress?> GetAddressByAddressId(int addressId)
        {
            var address = await _context.CustomerAddresses
                                                .Where(x => x.AddressId == addressId)
                                                .FirstOrDefaultAsync();

            return address;
        }

    }
}
