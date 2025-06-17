using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
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
        public async Task<AspNetUser> GetUserById(string userId)
        {
            var user = await _context.Users
                .Where(x => x.Id == userId)
                .FirstOrDefaultAsync();
            return user;
        }
    }
}
