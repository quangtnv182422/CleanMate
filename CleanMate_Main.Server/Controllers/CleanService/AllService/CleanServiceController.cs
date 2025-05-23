using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.CleanService.AllService;
using CleanMate_Main.Server.Services.CleanService.CleanPerHour;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.CleanService.AllService
{
    [Route("[controller]")]
    [ApiController]
    public class CleanServiceController : ControllerBase
    {

        private readonly IAllService_Service _allService;
        public CleanServiceController(IAllService_Service allService)
        {
            _allService = allService;
        }

        [HttpGet("all-clean-service")]
        public async Task<ActionResult<List<Service>>> GetAllServiceClean()
        {
            var result = await _allService.GetAllServiceAsync();

            if (result == null || result.Count == 0)
            {
                return NotFound("Không tìm thấy dịch vụ dọn dẹp theo giờ.");
            }

            return Ok(result);
        }

        [HttpGet("serviceId/{serviceId}")]
        public async Task<ActionResult<List<ServicePriceDTO>>> GetServicePriceByServiceId([FromBody]int serviceId)
        {
            var result = await _allService.GetServicePriceByServiceIdAsync(serviceId);

            if (result == null || result.Count == 0)
            {
                return NotFound($"Không tìm thấy mức giá cho dịch vụ có ID = {serviceId}.");
            }

            var dtoResult = result.Select(sp => new ServicePriceDTO
            {
                PriceId = sp.PriceId,
                Price = sp.Price,
                DurationId = sp.DurationId,
                DurationTime = sp.Duration?.DurationTime ?? 0,
                SquareMeterSpecific = sp.Duration.SquareMeterSpecific ?? "",
                ServiceId = sp.ServiceId,

            }).ToList();

            return Ok(dtoResult);
        }

    }
}
