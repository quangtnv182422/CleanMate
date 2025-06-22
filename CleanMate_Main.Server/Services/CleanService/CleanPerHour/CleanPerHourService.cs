using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Repository.CleanService.CleanPerHour;
using Microsoft.EntityFrameworkCore;
using CleanMate_Main.Server.Models.DTO;
using NuGet.Protocol.Core.Types;

namespace CleanMate_Main.Server.Services.CleanService.CleanPerHour
{
    public class CleanPerHourService : ICleanPerHourService
    {
        private readonly ICleanPerHourRepo _cleanPerHourRepo;

        public CleanPerHourService(ICleanPerHourRepo cleanPerHourRepo)
        {
            _cleanPerHourRepo = cleanPerHourRepo;
        }

        public async Task<List<CleanerDTO>> GetAvailableCleanersForTimeSlotAsync(DateTime startTime, DateTime endTime)
        {
            var requestDate = DateOnly.FromDateTime(startTime);
            var requestStartTime = TimeOnly.FromDateTime(startTime);
            var requestEndTime = TimeOnly.FromDateTime(endTime);

            var allCleaners = await _cleanPerHourRepo.GetAllCleanersAsync();
            var bookedCleaners = await _cleanPerHourRepo.GetBookedCleanersAsync(requestDate, requestStartTime, requestEndTime);

            var availableCleaners = allCleaners
                .Where(c => !bookedCleaners.Contains(c.CleanerId))
                .ToList();

            return availableCleaners;
        }

    }
}
