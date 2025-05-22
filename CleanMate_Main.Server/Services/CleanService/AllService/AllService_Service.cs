using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.CleanService.AllService;
using CleanMate_Main.Server.Repository.CleanService.CleanPerHour;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Services.CleanService.AllService
{
    public class AllService_Service : IAllService_Service
    {
        private readonly IAllServiceRepository _allServiceRepo;

        public AllService_Service(IAllServiceRepository allServiceRepo)
        {
            _allServiceRepo = allServiceRepo;
        }


        public Task<List<Service>> GetAllServiceAsync()
        {
            return _allServiceRepo.GetAllServiceAsync();
        }

        public Task<List<ServicePrice>> GetServicePriceByServiceIdAsync(int serviceId)
        {
            return _allServiceRepo.GetServicePriceByServiceIdAsync(serviceId);
        }
    }
}
