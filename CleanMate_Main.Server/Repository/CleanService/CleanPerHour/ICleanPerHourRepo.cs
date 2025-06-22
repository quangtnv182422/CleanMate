using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.CleanService.CleanPerHour
{
    public interface ICleanPerHourRepo
    {
        Task<List<CleanerDTO>> GetAllCleanersAsync();
        Task<List<string>> GetBookedCleanersAsync(DateOnly requestDate, TimeOnly requestStartTime, TimeOnly requestEndTime);

    }
}
