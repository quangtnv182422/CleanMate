namespace CleanMate_Main.Server.Services.Smtp
{
    public interface IEmailService
    {
        public Task SendConfirmEmail(string email, string confirmLink);
    }
}
