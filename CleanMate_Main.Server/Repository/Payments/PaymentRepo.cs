using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Repository.Payments
{
    public class PaymentRepo : IPaymentRepo
    {
        private readonly CleanMateMainDbContext _context;

        public PaymentRepo(CleanMateMainDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Payment> AddNewPaymentAsync(Payment newPayment)
        {
            await _context.Payments.AddAsync(newPayment);
            await _context.SaveChangesAsync();

            return newPayment;
        }

        public async Task<Payment> UpdatePaymentAsync(Payment newPayment)
        {
            var existingPayment = await _context.Payments.FirstOrDefaultAsync(x => x.BookingId == newPayment.BookingId);
            if (existingPayment == null)
                return null;

            _context.Entry(existingPayment).CurrentValues.SetValues(newPayment);
            await _context.SaveChangesAsync();

            return existingPayment;
        }

        public async Task<Payment?> FindPaymentById(int paymentId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

            return payment;
        }
        public async Task<IEnumerable<Payment>> GetPaymentsByBookingIdAsync(int bookingId)
        {
            var payments = await _context.Payments
                .Where(p => p.BookingId == bookingId)
                .ToListAsync();

            return payments;
        }
    }
}
