using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Services.Customer
{
    public interface ICustomerService
    {
        Task<PersonalProfileViewModel> GetPersonalProfileAsync(string userId);
        Task<bool> UpdatePersonalProfileAsync(PersonalProfileViewModel profile);
    }
}
