using CleanMate_Main.Server.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace CleanMate_Main.Server.SeedData
{
    public static class RoleData
    {
        public static async Task SeedRolesAsync(RoleManager<AspNetRole> roleManager)
        {
            var roleNames = new[] { "Admin", "Cleaner", "Customer" };

            foreach (var roleName in roleNames)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    var role = new AspNetRole
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpper()
                    };
                    await roleManager.CreateAsync(role);
                }
            }
        }
    }
}
