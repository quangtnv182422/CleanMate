using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Address;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpPost("add-address")]
        public async Task<ActionResult<CustomerAddress>> AddNewAddress([FromBody] CustomerAddressDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _addressService.AddNewAddressAsync(dto);
            return Ok(result);
        }

        [HttpPut("edit-address")]
        public async Task<ActionResult<CustomerAddress>> EditAddress([FromBody] CustomerAddressDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _addressService.EditAddressAsync(dto);
            if (result == null)
                return NotFound("Original address not found");

            return Ok(result);
        }
    }
}
