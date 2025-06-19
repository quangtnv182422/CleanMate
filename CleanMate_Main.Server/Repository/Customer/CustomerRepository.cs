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
    }
}
