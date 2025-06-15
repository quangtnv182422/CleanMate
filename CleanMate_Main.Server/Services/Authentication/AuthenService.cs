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

            var baseUrl = _configuration["SettingDomain:BaseUrl"];

            //NOTE: cái này đang fix cứng tạm thời
            var confirmationLink = $"{baseUrl}/email-confirmation?userId={user.Id}&token={encodedToken}";

            await _emailService.SendConfirmEmail(user.Email, confirmationLink);

            return (true, null);
        }

        public async Task<(bool Success, IEnumerable<string> Errors)> RegisterEmployeeAsync(RegisterModel model)
        {
            var errors = new List<string>();

            // Check email
            var existingEmailUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingEmailUser != null)
            {
                errors.Add("Email đã được sử dụng.");
            }

            // Check phone
            var existingPhoneUser = await _userManager.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
            if (existingPhoneUser != null)
            {
                errors.Add("Số điện thoại đã được sử dụng.");
            }

            // Check identification
            var existingIdentificationUser = await _userManager.Users
                .FirstOrDefaultAsync(u => u.CCCD == model.Identification);
            if (existingIdentificationUser != null)
            {
                errors.Add("Số định danh đã được sử dụng.");
            }

            // Check bank (optional: validate against VietQR API or a list)
            if (string.IsNullOrEmpty(model.Bank))
            {
                errors.Add("Mã ngân hàng không hợp lệ.");
            }

            // Proceed with user creation only if no validation errors so far
            if (!errors.Any())
            {
                var user = new AspNetUser
                {
                    UserName = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    FullName = model.FullName, 
                    Email = model.Email,
                    CCCD = model.Identification,
                    CreatedDate = DateTime.Now
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    errors.AddRange(result.Errors.Select(e => e.Description));
                }
                else
                {
                    // Assign role "Cleaner"
                    var roleResult = await _userManager.AddToRoleAsync(user, "Cleaner");
                    if (!roleResult.Succeeded)
                    {
                        errors.AddRange(roleResult.Errors.Select(e => e.Description));
                    }
                    else
                    {
                        user.BankName = model.Bank;
                        user.BankNo = model.BankAccount;
                        var updateResult = await _userManager.UpdateAsync(user);
                        if (!updateResult.Succeeded)
                        {
                            errors.AddRange(updateResult.Errors.Select(e => e.Description));
                        }
                        else
                        {
                            // Generate email confirmation token
                            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));


                            var baseUrl = _configuration["SettingDomain:BaseUrl"];

                            // Generate confirmation link (hardcoded for now, same as RegisterCustomerAsync)
                            var confirmationLink = $"{baseUrl}/email-confirmation?userId={user.Id}&token={encodedToken}";
                            // Send confirmation email
                            await _emailService.SendConfirmEmail(user.Email, confirmationLink);
                        }
                    }
                }
            }

            if (errors.Any())
            {
                return (false, errors);
            }

            return (true, null);
        }


        public async Task<(bool Success, string Token, string Error)> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
                return (false, null, "Tài khoản không tồn tại.");

            if (!user.EmailConfirmed)
                return (false, null, "Email chưa được xác thực. Vui lòng kiểm tra hộp thư để xác nhận tài khoản.");

            if (await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // Lấy roles
                var roles = await _userManager.GetRolesAsync(user);

                // Tạo danh sách claim
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.UserName)
                };

                // Thêm từng role vào claim
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                // Tạo token
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddDays(7),
                    signingCredentials: creds
                );

                string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
                return (true, jwtToken, null);
            }

            return (false, null, "Sai mật khẩu.");
        }

        public async Task<(bool Success, string Error)> ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !user.EmailConfirmed)
            {
                return (false, "Email không tồn tại hoặc chưa được xác thực.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var baseUrl = _configuration["SettingDomain:BaseUrl"];
            var resetLink = $"{baseUrl}/reset-password?userId={user.Id}&token={encodedToken}";

            await _emailService.SendResetPasswordEmail(user.Email, resetLink);

            return (true, null);
        }

        public async Task<(bool Success, string Error)> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return (false, "Người dùng không tồn tại.");
            }

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!result.Succeeded)
            {
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            return (true, null);
        }
        public async Task<(bool Success, string Error)> ResetPasswordAsync(string userId, string token, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return (false, "Người dùng không tồn tại.");
            }

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, newPassword);

            if (!result.Succeeded)
            {
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            return (true, null);
        }
    }
}
