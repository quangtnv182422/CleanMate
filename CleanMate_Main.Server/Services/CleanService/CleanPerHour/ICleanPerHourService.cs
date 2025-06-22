using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.CleanService.CleanPerHour
{
    public interface ICleanPerHourService
    {
        Task<List<CleanerDTO>> GetAvailableCleanersForTimeSlotAsync(DateTime startTime, DateTime endTime);
    }
}
