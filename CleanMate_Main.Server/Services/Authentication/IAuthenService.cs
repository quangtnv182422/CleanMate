using CleanMate_Main.Server.Models.ViewModels.Authen;

namespace CleanMate_Main.Server.Services.Authentication
{
    public interface IAuthenService
    {
        Task<(bool Success, IEnumerable<string> Errors)> RegisterCustomerAsync(RegisterModel model);
        Task<(bool Success, IEnumerable<string> Errors)> RegisterEmployeeAsync(RegisterModel model);
        Task<(bool Success, string Token, string Error)> LoginAsync(LoginModel model);
    }
}
