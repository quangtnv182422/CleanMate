using CleanMate_Main.Server.Common;
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
        public async Task<IEnumerable<WorkListViewModel>> FindAllWorkAsync(int? status = null, string? employeeId = null)
        {
            var query = from booking in _context.Bookings
                        join servicePrice in _context.ServicePrices on booking.ServicePriceId equals servicePrice.PriceId
                        join service in _context.Services on servicePrice.ServiceId equals service.ServiceId
                        join duration in _context.Durations on servicePrice.DurationId equals duration.DurationId
                        join customer in _context.Users on booking.UserId equals customer.Id
                        join address in _context.CustomerAddresses on booking.AddressId equals address.AddressId
                        where (status == null || booking.BookingStatusId == status)
                           && (employeeId == null || booking.CleanerId == employeeId)
                        select new WorkListViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            CustomerFullName = customer.FullName,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            Duration = duration.Duration1,
                            Address = address.AddressTitle,
                            Note = booking.Note,
                            TotalPrice = booking.TotalPrice ?? 0m,
                            Status = Common.CommonConstants.GetStatusString(booking.BookingStatusId)
                        };

            return await query.ToListAsync();
        }

        public async Task<WorkDetailsViewModel> FindWorkByIdAsync(int bookingId)
        {
            var query = from booking in _context.Bookings
                        join servicePrice in _context.ServicePrices on booking.ServicePriceId equals servicePrice.PriceId
                        join service in _context.Services on servicePrice.ServiceId equals service.ServiceId
                        join duration in _context.Durations on servicePrice.DurationId equals duration.DurationId
                        join customer in _context.Users on booking.UserId equals customer.Id
                        join address in _context.CustomerAddresses on booking.AddressId equals address.AddressId
                        where booking.BookingId == bookingId
                        select new WorkDetailsViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            ServiceDescription = service.Description,
                           // Duration = duration.Duration1,
                            Price = servicePrice.Price,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            Address = address.AddressTitle,
                            Note = booking.Note,
                            Status = CommonConstants.GetStatusString(booking.BookingStatusId),
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
                        join duration in _context.Durations on servicePrice.DurationId equals duration.DurationId
                        join customer in _context.Users on booking.UserId equals customer.Id
                        join address in _context.CustomerAddresses on booking.AddressId equals address.AddressId
                        where booking.CleanerId == employeeId
                        select new WorkListViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            CustomerFullName = customer.FullName,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            Duration = duration.Duration1,
                            Address = address.AddressTitle,
                            Note = booking.Note,
                            TotalPrice = booking.TotalPrice ?? 0m,
                            Status = CommonConstants.GetStatusString(booking.BookingStatusId)
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

        public async Task ChangeWorkAsync(int bookingId, int status, string? employeeId = null)
        {
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            booking.BookingStatusId = status;
            if (employeeId != null)
            {
                booking.CleanerId = employeeId;
            }
            await _context.SaveChangesAsync();
        }

        public async Task<AcceptWorkNotificationViewModel> GetCustomerDetailsAsync(int bookingId)
        {
            var query = from booking in _context.Bookings
                        join customer in _context.Users on booking.UserId equals customer.Id
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

        public async Task<int> GetWorkCountByStatusAsync(int status)
        {
            return await _context.Bookings
                .CountAsync(b => b.BookingStatusId == status);
        }

        public async Task UpdateWorkReadStatusAsync(int bookingId, bool isRead)
        {
            var booking = await _context.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            await _context.SaveChangesAsync();
        }
    }
}