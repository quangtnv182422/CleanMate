using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.Services.Feedbacks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Customer
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;

        public FeedbackController(IFeedbackService feedbackService, UserManager<AspNetUser> userManager, IEmployeeService employeeService)
        {
            _feedbackService = feedbackService;
            _userManager = userManager;
            _employeeService = employeeService;
        }

        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromBody] AddFeedbackDTO dto)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                    return Unauthorized();

                var user = await _userManager.FindByEmailAsync(userEmail);

                if (user == null)
                    return Unauthorized();

                if (string.IsNullOrEmpty(user.Id))
                {
                    return Unauthorized("Không thể xác định người dùng.");
                }

                await _feedbackService.AddFeedbackAsync(dto.BookingId, user.Id, dto.CleanerId, dto.Rating, dto.Content);
                await _employeeService.RecalculateCleanerRatingAsync(dto.CleanerId, (int) dto.Rating);
                return Ok("Feedback đã được thêm thành công.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{feedbackId}")]
        public async Task<IActionResult> UpdateFeedback(int feedbackId, [FromBody] UpdateFeedbackDTO dto)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                    return Unauthorized();

                var user = await _userManager.FindByEmailAsync(userEmail);

                if (user == null)
                    return Unauthorized();

                if (string.IsNullOrEmpty(user.Id))
                {
                    return Unauthorized("Không thể xác định người dùng.");
                }

                await _feedbackService.UpdateFeedbackAsync(feedbackId, user.Id, dto.Rating, dto.Content);
                return Ok("Feedback đã được cập nhật thành công.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{feedbackId}")]
        public async Task<IActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userEmail))
                    return Unauthorized();

                var user = await _userManager.FindByEmailAsync(userEmail);

                if (user == null)
                    return Unauthorized();

                if (string.IsNullOrEmpty(user.Id))
                {
                    return Unauthorized("Không thể xác định người dùng.");
                }

                await _feedbackService.DeleteFeedbackAsync(feedbackId, user.Id);
                return Ok("Feedback đã được xóa thành công.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
