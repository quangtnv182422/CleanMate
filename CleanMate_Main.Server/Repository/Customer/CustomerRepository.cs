using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Customer
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly CleanMateMainDbContext _context;
        private readonly UserManager<AspNetUser> _userManager;

        public CustomerRepository(CleanMateMainDbContext context, UserManager<AspNetUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<List<CustomerListItemDTO>> GetCustomerListAsync()
        {
            var usersInCustomerRole = await _userManager.GetUsersInRoleAsync("Customer");

            var customerList = usersInCustomerRole
                .OrderBy(u => u.UserName)
                .Select(u => new CustomerListItemDTO
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    CreatedDate = u.CreatedDate,
                    PhoneNumber = u.PhoneNumber,
                    IsActive = !u.LockoutEnabled
                })
                .ToList();

            return customerList;
        }

        public async Task LockUserAccountAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.LockoutEnabled = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task UnlockUserAccountAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.LockoutEnabled = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<AspNetUser> GetUserById(string userId)
        {
            var user = await _context.Users
                .Where(x => x.Id == userId)
                .FirstOrDefaultAsync();
            return user;
        }

        public async Task<CustomerDetailDTO> GetCustomerDetailAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.CustomerAddresses)
                .Include(u => u.Wallet)
                .ThenInclude(w => w.Transactions)
                .Include(u => u.BookingUsers)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return null;
            }

            var customerDetail = new CustomerDetailDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CreatedDate = user.CreatedDate,
                IsActive = !user.LockoutEnabled,
                Addresses = user.CustomerAddresses.Select(a => new CustomerAddressDTO
                {
                    AddressId = a.AddressId,
                    GG_FormattedAddress = a.GG_FormattedAddress,
                    GG_DispalyName = a.GG_DispalyName,
                    GG_PlaceId = a.GG_PlaceId,
                    AddressNo = a.AddressNo,
                    IsInUse = a.IsInUse,
                    IsDefault = a.IsDefault,
                    Latitude = a.Latitude,
                    Longitude = a.Longitude
                }).ToList(),
                WalletBalance = user.Wallet?.Balance ?? 0,
                Transactions = user.Wallet?.Transactions.Select(t => new WalletTransactionDTO
                {
                    TransactionId = t.TransactionId,
                    Amount = t.Amount,
                    TransactionType = t.TransactionType,
                    Description = t.Description,
                    CreatedAt = t.CreatedAt
                }).ToList() ?? new List<WalletTransactionDTO>(),
                Bookings = user.BookingUsers.Select(b => new BookingDTO
                {
                    BookingId = b.BookingId,
                    ServicePriceId = b.ServicePriceId,
                    CleanerId = b.CleanerId,
                    AddressId = b.AddressId,
                    TotalPrice = b.TotalPrice,
                    Note = b.Note,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    BookingStatusId = b.BookingStatusId
                }).ToList()
            };

            return customerDetail;
        }
    }
}
