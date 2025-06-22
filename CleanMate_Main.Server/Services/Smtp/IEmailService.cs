using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Smtp
{
    public interface IEmailService
    {
        public Task SendConfirmEmail(string email, string confirmLink);
        Task SendResetPasswordEmail(string email, string resetLink);
        Task SendNewBookingNotify(string email, Booking booking);
    }
}
