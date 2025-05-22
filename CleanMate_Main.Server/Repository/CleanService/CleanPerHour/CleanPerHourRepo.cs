using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.CleanService.CleanPerHour
{
    public class CleanPerHourRepo : ICleanPerHourRepo
    {
        private readonly CleanMateMainDbContext _context;

        public CleanPerHourRepo(CleanMateMainDbContext context) {
            _context = context;
        }

    }
}
