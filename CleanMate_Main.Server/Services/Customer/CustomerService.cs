using CleanMate_Main.Server.Models.ViewModels.Employee;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Repository.Wallet;
using CleanMate_Main.Server.Services.Wallet;

namespace CleanMate_Main.Server.Services.Customer
{
    public class CustomerService : ICustomerService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IUserWalletRepo _userWalletRepo;

        public CustomerService(IEmployeeRepository employeeRepository, IUserWalletRepo userWalletRepo)
        {
            _employeeRepository = employeeRepository ?? throw new ArgumentNullException(nameof(employeeRepository));
            _userWalletRepo = userWalletRepo ?? throw new ArgumentNullException(nameof(_userWalletRepo));
        }
        public async Task<PersonalProfileViewModel> GetPersonalProfileAsync(string employeeId)
        {
            var user = await _employeeRepository.GetPersonalProfileAsync(employeeId);
            var wallet = await _userWalletRepo.GetWalletByUserIdAsync(employeeId);
            PersonalProfileViewModel model = new PersonalProfileViewModel
            {
                UserId = employeeId,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                AvatarUrl = user.AvatarUrl,
                Gender = user.Gender,
                Dob = user.Dob,
                Balance = wallet?.Balance
            };
            return model;
        }

        public async Task<bool> UpdatePersonalProfileAsync(PersonalProfileViewModel profile)
        {
            if (string.IsNullOrEmpty(profile.UserId))
            {
                throw new ArgumentException("UserId không được để trống.");
            }
            var success = await _employeeRepository.UpdatePersonalProfileAsync(profile);
            if (!success)
            {
                throw new InvalidOperationException("Cập nhật hồ sơ thất bại.");
            }
            return true;
        }
    }
}
