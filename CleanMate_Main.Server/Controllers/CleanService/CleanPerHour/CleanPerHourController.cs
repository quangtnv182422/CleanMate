using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Authentication;
using CleanMate_Main.Server.Services.CleanService.CleanPerHour;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.CleanService.CleanPerHour
{
    [Route("[controller]")]
    [ApiController]
    public class CleanPerHourController : ControllerBase
    {
        private readonly ICleanPerHourService _cleanPerHourService;
        public CleanPerHourController(ICleanPerHourService cleanPerHourService)
        {
            _cleanPerHourService = cleanPerHourService;
        }

       /* [HttpGet]
        public async Task<ActionResult<List<ServicePrice>>> GetAllServiceCleanPerHour()
        {
            var result = await _cleanPerHourService.GetAllServiceCleanPerHourAsync();

            if (result == null || result.Count == 0)
            {
                return NotFound("Không tìm thấy dịch vụ dọn dẹp theo giờ.");
            }

            return Ok(result);
        }*/
    }
}
