using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.ServiceDuration.CleanPerHour
{
    public class CleanPerHour : ICleanPerHour
    {
        private readonly CleanMateMainDbContext _context;

        public CleanPerHour(CleanMateMainDbContext context) {
            _context = context;
        }

        public Task<List<ServicePrice>> GetAllServiceCleanPerHourAsync()
        {
            var listServicePrice =  _context.ServicePrices
                                   .Include(x => x.Duration)
                                   .Include(x => x.Service)
                                   .ToListAsync();
            return listServicePrice;
        }
    }
}
