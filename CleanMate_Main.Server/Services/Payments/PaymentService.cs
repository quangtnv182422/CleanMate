using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.Payments;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Services.Payments
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepo _paymentRepo;

        public PaymentService(IPaymentRepo paymentRepo)
        {
            _paymentRepo = paymentRepo;
        }

        public async Task<Payment> AddNewPaymentAsync(Payment newPayment)
        {
            return await _paymentRepo.AddNewPaymentAsync(newPayment);
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByBookingIdAsync(int bookingId)
        {
            return await _paymentRepo.GetPaymentsByBookingIdAsync(bookingId);
        }

        public async Task<PaymentDTO?> MarkBookingAsPaidAsync(int paymentId, string transaction)
        {
            var payment = await _paymentRepo.FindPaymentById(paymentId);
            if (payment == null)
                return null;

            payment.PaymentStatus = "Paid";
            payment.TransactionId = transaction;

            var updatedPayment = await _paymentRepo.UpdatePaymentAsync(payment);

            var resultDto = new PaymentDTO
            {
                PaymentId = updatedPayment.PaymentId,
                BookingId = updatedPayment.BookingId,
                Amount = updatedPayment.Amount,
                PaymentMethod = updatedPayment.PaymentMethod,
                PaymentStatus = updatedPayment.PaymentStatus,
                TransactionId = updatedPayment.TransactionId,
                CreatedAt = updatedPayment.CreatedAt
            };

            return resultDto;
        }
    }
}
