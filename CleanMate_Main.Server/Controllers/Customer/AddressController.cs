using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Address;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserHelper<AspNetUser> _userHelper;

        public AddressController(IAddressService addressService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper)
        {
            _addressService = addressService;
            _userManager = userManager;
            _userHelper = userHelper;
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

        [HttpGet("get-address")]
        public async Task<ActionResult<List<CustomerAddress>>> GetAddressInUse()
        {
            var user = await _userHelper.GetCurrentUserAsync();

            if (user == null)
                return Unauthorized();

            var addresses = await _addressService.GetAddressInUseByCustomerId(user.Id);

            return Ok(addresses);
        }


    }
}
