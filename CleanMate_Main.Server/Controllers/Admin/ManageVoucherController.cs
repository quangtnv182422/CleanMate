using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Vouchers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Admin
{
    [Route("[controller]")]
    [ApiController]
    public class ManageVoucherController : ControllerBase
    {
        private readonly IVoucherService _voucherService;
        private readonly UserHelper<AspNetUser> _userHelper;
        private readonly UserManager<AspNetUser> _userManager;
        public ManageVoucherController(IVoucherService voucherService,  UserHelper<AspNetUser> userHelper, UserManager<AspNetUser> userManager)
        {
            _voucherService = voucherService;
            _userHelper = userHelper;
            _userManager = userManager;
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
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });
                if (!await _userManager.IsInRoleAsync(user, "Admin"))
                    return Unauthorized(new { message = "Chỉ admin mới có thể tạo voucher." });

                await _voucherService.CreateVoucherAsync(voucherDto, user.Id);
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


        [HttpPost("assign")]
        public async Task<IActionResult> AssignVoucher([FromBody] AssignVoucherDTO assignDto)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();
                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                if (!await _userManager.IsInRoleAsync(user, "Admin"))
                    return Unauthorized(new { message = "Chỉ admin mới có thể gán voucher." });

                await _voucherService.AssignVoucherToUserAsync(assignDto.UserId, assignDto.VoucherId, assignDto.Quantity);
                return Ok(new { message = "Voucher đã được gán thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("assign-multiple")]
        public async Task<IActionResult> AssignVoucherToMultiple([FromBody] AssignVoucherMultipleDTO assignDto)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();
                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                if (!await _userManager.IsInRoleAsync(user, "Admin"))
                    return Unauthorized(new { message = "Chỉ admin mới có thể gán voucher." });

                await _voucherService.AssignVoucherToUsersAsync(assignDto.UserIds, assignDto.VoucherId, assignDto.Quantity);
                return Ok(new { message = "Voucher đã được gán thành công cho các khách hàng." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
