using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.CleanService.AllService
{
    public interface IAllService_Service
    {
        Task<List<Service>> GetAllServiceAsync();
        Task<List<ServicePrice>> GetServicePriceByServiceIdAsync(int serviceId);
    }
}
