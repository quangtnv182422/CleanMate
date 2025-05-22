using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Repository.CleanService.CleanPerHour;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Services.CleanService.CleanPerHour
{
    public class CleanPerHourService : ICleanPerHourService
    {
        private readonly ICleanPerHourRepo _cleanPerHourRepo;

        public CleanPerHourService(ICleanPerHourRepo cleanPerHourRepo)
        {
            _cleanPerHourRepo = cleanPerHourRepo;
        }



    }
}
