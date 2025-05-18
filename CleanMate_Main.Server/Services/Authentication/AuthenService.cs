using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Authen;
using CleanMate_Main.Server.Services.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace CleanMate_Main.Server.Services.Authentication
{
    public class AuthenService : IAuthenService
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthenService(UserManager<AspNetUser> userManager, IConfiguration configuration, IEmailService emailService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<(bool Success, IEnumerable<string> Errors)> RegisterCustomerAsync(RegisterModel model)
        {
            var errors = new List<string>();

            // check mail
            var existingEmailUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingEmailUser != null)
            {
                errors.Add("Email đã được sử dụng.");
            }

            // check phone
            var existingPhoneUser = await _userManager.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
            if (existingPhoneUser != null)
            {
                errors.Add("Số điện thoại đã được sử dụng.");
            }

            if (errors.Any())
            {
                return (false, errors);
            }
            // add new user
            var user = new AspNetUser
            {
                UserName = model.Email,
                PhoneNumber = model.PhoneNumber,
                FullName = model.FullName,
                Email = model.Email,
                CreatedDate = DateTime.Now
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return (false, result.Errors.Select(e => e.Description));
            }

            // gán role customer
            var roleResult = await _userManager.AddToRoleAsync(user, "Customer");
            if (!roleResult.Succeeded)
            {
                return (false, roleResult.Errors.Select(e => e.Description));
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            //NOTE: cái này đang fix cứng tạm thời
            var confirmationLink = $"https://localhost:60391/email-confirmation?userId={user.Id}&token={encodedToken}";

            await _emailService.SendConfirmEmail(user.Email, confirmationLink);

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
