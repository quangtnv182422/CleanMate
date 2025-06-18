using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Customer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Services.Customer
{


    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repository;
        private readonly UserManager<AspNetUser> _userManager;
        public CustomerService(ICustomerRepository repository, UserManager<AspNetUser> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        public async Task<List<CustomerListItemDTO>> GetCustomerListAsync()
        {
            return await _repository.GetCustomerListAsync();
        }

        public async Task LockUserAccountAsync(string userId)
        {
            await _repository.LockUserAccountAsync(userId);
        }

        public async Task UnlockUserAccountAsync(string userId)
        {
            await _repository.UnlockUserAccountAsync(userId);
        }
        public async Task<CustomerProfileViewModel> GetCustomerProfileAsync(string userId)
        {
            var user = await _repository.GetUserById(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng.");
            }

            var profile = new CustomerProfileViewModel
            {
                UserId = userId,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                AvatarUrl = user.ProfileImage
                // Add other customer-specific fields as needed
            };
            return profile;
        }

        public async Task<bool> UpdateCustomerProfileAsync(CustomerProfileViewModel profile)
        {
            if (string.IsNullOrEmpty(profile.UserId))
            {
                throw new ArgumentException("UserId không được để trống.");
            }

            var user = await _repository.GetUserById(profile.UserId);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng để cập nhật.");
            }

            user.FullName = profile.FullName ?? user.FullName;
            user.Email = profile.Email ?? user.Email;
            user.PhoneNumber = profile.PhoneNumber ?? user.PhoneNumber;
            user.ProfileImage = profile.AvatarUrl ?? user.ProfileImage;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }

    public class CustomerProfileViewModel
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AvatarUrl { get; set; }
        // Add other customer-specific fields (e.g., Address) as needed
    }
}