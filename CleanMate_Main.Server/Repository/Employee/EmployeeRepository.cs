using CleanMate_Main.Server.Models;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.ViewModels.Employee;
using Microsoft.EntityFrameworkCore;
namespace CleanMate_Main.Server.Repository.Employee
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly CleanMateMainDbContext _context;

        public EmployeeRepository(CleanMateMainDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<IEnumerable<WorkListViewModel>> FindAllWorkAsync(string? status = null, string? employeeId = null)
        {
            var query = from booking in _context.Bookings
                        join servicePrice in _context.ServicePrices on booking.ServicePriceId equals servicePrice.PriceId
                        join service in _context.Services on servicePrice.ServiceId equals service.ServiceId
                        join statusEntity in _context.BookingStatuses on booking.BookingStatusId equals statusEntity.BookingStatusId
                        where (status == null || statusEntity.Status == status)
                           && (employeeId == null || booking.CleanerId == employeeId)
                        select new WorkListViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            Status = statusEntity.Status,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            TotalPrice = booking.TotalPrice ?? 0m
                        };

            return await query.ToListAsync();
        }

        public async Task<WorkDetailsViewModel> FindWorkByIdAsync(int bookingId)
        {
            var query = from booking in _context.Bookings
                        join servicePrice in _context.ServicePrices on booking.ServicePriceId equals servicePrice.PriceId
                        join service in _context.Services on servicePrice.ServiceId equals service.ServiceId
                        join duration in _context.Durations on servicePrice.DurationId equals duration.DurationId
                        join status in _context.BookingStatuses on booking.BookingStatusId equals status.BookingStatusId
                        join customer in _context.Users on booking.UserId equals customer.Id
                        where booking.BookingId == bookingId
                        select new WorkDetailsViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            ServiceDescription = service.Description,
                            Duration = duration.Duration1,
                            Price = servicePrice.Price,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            Address = booking.Address,
                            Note = booking.Note,
                            Status = status.Status,
                            IsRead = false,
                            CustomerFullName = customer.FullName,
                            CustomerPhoneNumber = customer.PhoneNumber
                        };

            return await query.FirstOrDefaultAsync() ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
        }

        public async Task<IEnumerable<WorkListViewModel>> FindWorkByEmployeeIdAsync(string employeeId)
        {
            var query = from booking in _context.Bookings
                        join servicePrice in _context.ServicePrices on booking.ServicePriceId equals servicePrice.PriceId
                        join service in _context.Services on servicePrice.ServiceId equals service.ServiceId
                        join status in _context.BookingStatuses on booking.BookingStatusId equals status.BookingStatusId
                        where booking.CleanerId == employeeId
                        select new WorkListViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            Status = status.Status,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            TotalPrice = booking.TotalPrice ?? 0m
                        };

            return await query.ToListAsync();
        }

        public async Task UpdateWorkStatusAsync(int bookingId, string status)
        {
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            booking.BookingStatusId = await _context.BookingStatuses
                .Where(s => s.Status == status)
                .Select(s => s.BookingStatusId)
                .FirstOrDefaultAsync();
            await _context.SaveChangesAsync();
        }

        public async Task AcceptWorkAsync(int bookingId, string employeeId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            booking.CleanerId = employeeId;
            booking.BookingStatusId = await _context.BookingStatuses
                .Where(s => s.Status == "Confirmed")
                .Select(s => s.BookingStatusId)
                .FirstOrDefaultAsync();
            await _context.SaveChangesAsync();
        }

        public async Task CancelWorkAsync(int bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            booking.BookingStatusId = await _context.BookingStatuses
                .Where(s => s.Status == "Canceled")
                .Select(s => s.BookingStatusId)
                .FirstOrDefaultAsync();
            await _context.SaveChangesAsync();
        }

        public async Task CompleteWorkAsync(int bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            booking.BookingStatusId = await _context.BookingStatuses
                .Where(s => s.Status == "Completed")
                .Select(s => s.BookingStatusId)
                .FirstOrDefaultAsync();
            await _context.SaveChangesAsync();
        }

        public async Task<AcceptWorkNotificationViewModel> GetCustomerDetailsAsync(int bookingId)
        {
            var query = from booking in _context.Bookings
                        join customer in _context.AspNetUsers on booking.UserId equals customer.Id
                        where booking.BookingId == bookingId
                        select new AcceptWorkNotificationViewModel
                        {
                            BookingId = booking.BookingId,
                            CustomerFullName = customer.FullName,
                            CustomerPhoneNumber = customer.PhoneNumber,
                            CustomerEmail = customer.Email
                        };

            return await query.FirstOrDefaultAsync() ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
        }

        public async Task<int> GetWorkCountByStatusAsync(string status)
        {
            return await _context.Bookings
                .Join(_context.BookingStatuses,
                    b => b.BookingStatusId,
                    s => s.BookingStatusId,
                    (b, s) => new { Booking = b, Status = s })
                .CountAsync(x => x.Status.Status == status);
        }

        public async Task UpdateWorkReadStatusAsync(int bookingId, bool isRead)
        {
            // Assuming a separate table or property for read status (e.g., Booking.ReadStatus)
            // For simplicity, we'll add a property to Booking entity if not exists
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            // If Booking entity doesn't have IsRead, you might need to add it or use a separate table
            // booking.IsRead = isRead; // Uncomment and add to Booking entity if needed
            await _context.SaveChangesAsync();
        }
    }
}
