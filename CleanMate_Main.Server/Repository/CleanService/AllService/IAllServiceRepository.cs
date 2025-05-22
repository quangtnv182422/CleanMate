using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.CleanService.AllService
{
    public interface IAllServiceRepository
    {
        Task<List<Service>> GetAllServiceAsync();
        Task<List<ServicePrice>> GetServicePriceByServiceIdAsync(int serviceId);
    }
}
