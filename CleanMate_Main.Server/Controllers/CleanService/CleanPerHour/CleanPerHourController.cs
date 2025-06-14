using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Authentication;
using CleanMate_Main.Server.Services.CleanService.CleanPerHour;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

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

        [HttpGet("available")]
        public async Task<ActionResult<List<CleanerDTO>>> GetAvailableCleaners([FromQuery] DateTime startTime, [FromQuery] DateTime endTime)
        {
            try
            {
                var availableCleaners = await _cleanPerHourService.GetAvailableCleanersForTimeSlotAsync(startTime, endTime);
                return Ok(availableCleaners);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized("Bạn không có quyền thực hiện hành động này.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu.");
            }
        }
    }
}
