using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Employee;

namespace CleanMate_Main.Server.Repository.Customer
{
    public interface ICustomerRepository
    {
        Task<AspNetUser> GetUserById(string userId);


    }
}
