using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Vouchers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    public class CustomerVoucherController : ControllerBase
    {
        private readonly IVoucherService _voucherService;
        private readonly UserHelper<AspNetUser> _userHelper;

        public CustomerVoucherController(IVoucherService voucherService, UserHelper<AspNetUser> userHelper)
        {
            _voucherService = voucherService;
            _userHelper = userHelper;
        }

        /// <summary>
        /// Lấy danh sách voucher chưa sử dụng của khách hàng hiện tại
        /// </summary>
        /// <returns>Danh sách voucher khả dụng</returns>
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<UserVoucherDTO>>> GetAvailableVouchers()
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();
                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var vouchers = await _voucherService.GetAvailableVouchersForUserAsync(user.Id);
                return Ok(vouchers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Áp dụng voucher cho đơn hàng
        /// </summary>
        /// <param name="applyDto">Thông tin voucher và tổng tiền đơn hàng</param>
        /// <returns>Kết quả áp dụng voucher</returns>
        [HttpPost("apply")]
        public async Task<ActionResult<ApplyVoucherResult>> ApplyVoucher([FromBody] ApplyVoucherDTO applyDto)
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();
                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var result = await _voucherService.ApplyVoucherAsync(user.Id, applyDto.VoucherCode, applyDto.TotalAmount);
                if (!result.Success)
                    return BadRequest(result.Message);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
