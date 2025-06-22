using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Services.Payments
{
    public interface IPaymentService
    {
        Task<Payment> AddNewPaymentAsync(Payment newPayment);
        Task<PaymentDTO?> MarkBookingAsPaidAsync(int paymentId, string? transaction);
        Task<Payment> GetPaymentsByBookingIdAsync(int bookingId);

    }
}
