using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace CleanMate_Main.Server.Services.Smtp
{
    public class EmailService : IEmailService
    {

        private readonly IEmailSender _emailSender;
        public EmailService(IEmailSender emailSender)
        {
            if (emailSender == null)
            {
                throw new ArgumentNullException(nameof(emailSender), "IEmailSender is null!");
            }
            _emailSender = emailSender;
        }

        public async Task SendConfirmEmail(string email, string confirmLink)
        {
            string subject = "Chào mừng bạn đến với CleanMate!";
            string message = $@"
                <h3>Vui lòng xác nhận email của bạn</h3>
                <p>Nhấn vào liên kết sau để xác nhận:</p>
                <a href='{confirmLink}'>Xác nhận email</a>
    ";
            await _emailSender.SendEmailAsync(email, subject, message);
        }

        public async Task SendResetPasswordEmail(string email, string resetLink)
        {
            string subject = "Yêu cầu đặt lại mật khẩu";
            string message = $@"
                <h3>Đặt lại mật khẩu của bạn</h3>
                <p>Nhấn vào liên kết sau để đặt lại mật khẩu:</p>
                <a href='{resetLink}'>Đặt lại mật khẩu</a>
            ";
            await _emailSender.SendEmailAsync(email, subject, message);
        }

        public async Task SendNewBookingNotify(string email, Booking booking)
        {
            string subject = $"Bạn có một booking mới với mã User là: {booking.UserId} vào ngày {booking.Date.ToString("dd/MM/yyyy")}";
            string message = $@"
                <h3>Có booking mới</h3>
                <p>Thông tin booking:</p>
                <ul>
                    <li>Mã User: {booking.UserId}</li>
                    <li>Ngày: {booking.Date}</li>
                    <li>Thời gian bắt đầu: {booking.StartTime}</li>
                    <li>Địa chỉ ID: {booking.AddressId}</li>
                    <li>Ghi chú: {booking.Note ?? "Không có"}</li>
                    <li>Tổng giá: {booking.TotalPrice?.ToString("C", new System.Globalization.CultureInfo("vi-VN")) ?? "Chưa xác định"}</li>
                </ul>
    ";
            await _emailSender.SendEmailAsync(email, subject, message);
        }
    }
}
