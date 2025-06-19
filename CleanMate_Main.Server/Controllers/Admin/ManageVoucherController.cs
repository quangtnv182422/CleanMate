using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Vouchers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    public class ManageVoucherController : ControllerBase
    {
        private readonly IVoucherService _voucherService;

        public ManageVoucherController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VoucherDTO>>> GetAllVouchers()
        {
            var vouchers = await _voucherService.GetAllVouchersAsync();
            return Ok(vouchers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VoucherDTO>> GetVoucher(int id)
        {
            var voucher = await _voucherService.GetVoucherByIdAsync(id);
            if (voucher == null)
                return NotFound("Voucher not found.");
            return Ok(voucher);
        }

        [HttpPost]
        public async Task<ActionResult<VoucherDTO>> CreateVoucher([FromBody] VoucherDTO voucherDto)
        {
            try
            {
                var adminId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(adminId))
                    return Unauthorized("Admin ID not found in token.");

                await _voucherService.CreateVoucherAsync(voucherDto, adminId);
                return CreatedAtAction(nameof(GetVoucher), new { id = voucherDto.VoucherId }, voucherDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVoucher(int id, [FromBody] VoucherDTO voucherDto)
        {
            if (id != voucherDto.VoucherId)
                return BadRequest("Voucher ID mismatch.");

            try
            {
                await _voucherService.UpdateVoucherAsync(voucherDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoucher(int id)
        {
            try
            {
                await _voucherService.DeleteVoucherAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
