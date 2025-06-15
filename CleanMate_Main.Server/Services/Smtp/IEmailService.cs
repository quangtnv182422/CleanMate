namespace CleanMate_Main.Server.Services.Smtp
{
    public interface IEmailService
    {
        public Task SendConfirmEmail(string email, string confirmLink);
        Task SendResetPasswordEmail(string email, string resetLink);
    }
}
