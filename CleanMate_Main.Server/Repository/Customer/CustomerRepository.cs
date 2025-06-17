using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Customer
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly CleanMateMainDbContext _context;

        public CustomerRepository(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerListItemDTO>> GetCustomerListAsync(string search)
        {
            var query = _context.Users
                .Where(u => u.Roles.Any(r => r.Name == "Customer"));

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.UserName.Contains(search) || u.Email.Contains(search));
            }

            var customers = await query
                .OrderBy(u => u.UserName)
                .Select(u => new CustomerListItemDTO
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    CreatedDate = u.CreatedDate,
                    PhoneNumber = u.PhoneNumber,
                    IsActive = !u.LockoutEnabled || (u.LockoutEnd == null || u.LockoutEnd < DateTimeVN.GetNow())
                })
                .ToListAsync();

            return customers;
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
    }
}
