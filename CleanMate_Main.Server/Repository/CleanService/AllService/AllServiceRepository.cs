using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.CleanService.AllService
{
    public class AllServiceRepository : IAllServiceRepository
    {
        private readonly CleanMateMainDbContext _context;

        public AllServiceRepository(CleanMateMainDbContext context)
        {
            _context = context;
        }

        public Task<List<Service>> GetAllServiceAsync()
        {
            var listServicePrice = _context.Services
                                   .ToListAsync();
            return listServicePrice;
        }

        public Task<List<ServicePrice>> GetServicePriceByServiceIdAsync(int serviceId)
        {
            var listServicePrice = _context.ServicePrices
                                 .Include(x => x.Duration)
                                 .Include(x => x.Service)
                                 .Where(x => x.ServiceId == serviceId)
                                 .ToListAsync();


            return listServicePrice;
        }

    }
}

