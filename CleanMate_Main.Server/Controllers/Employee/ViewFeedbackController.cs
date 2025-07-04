﻿using CleanMate_Main.Server.Common.Utils;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Services.Employee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanMate_Main.Server.Controllers.Employee
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Cleaner")]
    public class ViewFeedbackController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserHelper<AspNetUser> _userHelper;

        public ViewFeedbackController(IEmployeeService employeeService, UserManager<AspNetUser> userManager, UserHelper<AspNetUser> userHelper)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _userHelper = userHelper;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetFeedbackHistory()
        {
            try
            {
                var user = await _userHelper.GetCurrentUserAsync();

                if (user == null)
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var feedbackHistory = await _employeeService.GetFeedbackHistoryAsync(user.Id);
                return Ok(new { success = true, data = feedbackHistory });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Đã xảy ra lỗi khi lấy lịch sử phản hồi: {ex.Message}" });
            }
        }

        
    }
}
