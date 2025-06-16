using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace CleanMate_Main.Server.Common.Utils
{
    public class UserHelper<TUser> where TUser : class
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<TUser> _userManager;

        public UserHelper(IHttpContextAccessor httpContextAccessor, UserManager<TUser> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<TUser?> GetCurrentUserAsync()
        {
            var userEmail = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userEmail)) return null;

            var user = await _userManager.FindByEmailAsync(userEmail);
            return user;
        }
    }
}

