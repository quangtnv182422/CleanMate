using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.ServiceDuration.CleanPerHour
{
    public interface ICleanPerHour
    {
        Task<List<ServicePrice>> GetAllServiceCleanPerHourAsync();

    }
}
