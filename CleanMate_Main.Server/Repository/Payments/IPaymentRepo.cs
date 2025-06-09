using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Repository.Payments
{
    public interface IPaymentRepo
    {
        Task<Payment> AddNewPaymentAsync(Payment newPayment);
        Task<Payment> UpdatePaymentAsync(Payment newPayment);
        Task<Payment?> FindPaymentById(int paymentId);
        Task<IEnumerable<Payment>> GetPaymentsByBookingIdAsync(int bookingId);
    }
}
