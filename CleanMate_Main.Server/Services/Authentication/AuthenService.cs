using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Authen;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CleanMate_Main.Server.Services.Authentication
{
    public class AuthenService : IAuthenService
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthenService(UserManager<AspNetUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<(bool Success, IEnumerable<string> Errors)> RegisterAsync(RegisterModel model)
        {

            var user = new AspNetUser
            {
                UserName = model.Email,
                Email = model.Email,
                CreatedDate = DateTime.Now 
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return (false, result.Errors.Select(e => e.Description));
            }

            return (true, null);
        }

        public async Task<(bool Success, string Token, string Error)> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

                string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
                return (true, jwtToken, null);
            }

            return (false, null, "Sai thông tin đăng nhập");
        }
    }
}
