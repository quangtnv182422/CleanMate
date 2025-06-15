using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.CleanService.AllService;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace CleanMate_Main.Server.Services.Bookings
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepo;

        public BookingService(IBookingRepository bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }


        public async Task<Booking> AddNewBookingAsync(BookingCreateDTO dto)
        {
            var booking = new Booking
            {
                ServicePriceId = dto.ServicePriceId,
                CleanerId = dto.CleanerId,
                UserId = dto.UserId,
                BookingStatusId = CommonConstants.BookingStatus.NEW, //Mới tạo thì để new
                Note = dto.Note,
                AddressId = dto.AddressId,
                Date = dto.Date,
                StartTime = dto.StartTime,
                TotalPrice = dto.TotalPrice,
                CreatedAt = DateTime.Now,
                UpdatedAt = null
            };

            return await _bookingRepo.AddBookingAsync(booking);
        }


        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
           return await _bookingRepo.GetBookingByIdAsync(bookingId);
        }

        public async Task<List<BookingDTO>> GetBookingsByUserIdAsync(string userId, int? statusId)
        {
            var bookings = await _bookingRepo.GetBookingsByUserIdAsync(userId, statusId);

            var bookingDtos = bookings.Select(b => new BookingDTO
            {
                BookingId = b.BookingId,
                ServicePriceId = b.ServicePriceId,
                ServiceName = b.ServicePrice.Service.Name,
                DurationTime = b.ServicePrice.Duration.DurationTime,
                DurationSquareMeter = b.ServicePrice.Duration.SquareMeterSpecific,
                Price = b.ServicePrice.Price,
                CleanerId = b.CleanerId,
                CleanerName = b.Cleaner?.UserName ?? "Chưa phân công",
                UserId = b.UserId,
                UserName = b.User.FullName,
                BookingStatusId = b.BookingStatusId,
                Status = CommonConstants.GetStatusString(b.BookingStatusId),
                StatusDescription = b.BookingStatus.StatusDescription,
                Note = b.Note,
                AddressId = b.AddressId,
                AddressFormatted = b.Address?.GG_DispalyName ?? "Chưa có địa chỉ",
                Date = b.Date,
                StartTime = b.StartTime,
                TotalPrice = b.TotalPrice,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                HasFeedback = b.Feedbacks.Any()
            }).ToList();

            return bookingDtos;
        }
        public async Task<List<BookingAdminDTO>> GetBookingsForAdminAsync(int? status = null)
        {
            var bookings = await _bookingRepo.GetBookingsForAdminAsync(status);
            return bookings.Select(b => new BookingAdminDTO
            {
                BookingId = b.BookingId,
                ServiceName = b.ServicePrice.Service.Name,
                CustomerFullName = b.User.FullName,
                Date = b.Date,
                StartTime = b.StartTime,
                Duration = b.ServicePrice.Duration.DurationTime,
                Address = b.Address.GG_FormattedAddress,
                Note = b.Note,
                TotalPrice = b.TotalPrice ?? 0m,
                Status = b.BookingStatus.Status,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                CleanerId = b.CleanerId,
                CleanerName = b.Cleaner != null ? b.Cleaner.FullName : null
            }).ToList();
        }

        public async Task<bool> ProcessBookingAfterAssigningCleanerAsync(int bookingId, string cleanerId)
        {
            return await _bookingRepo.ProcessBookingAfterAssigningCleanerAsync(bookingId, cleanerId);
        }

        public async Task<bool> CancelBookingAsync(int bookingId)
        {
            return await _bookingRepo.CancelBookingAsync(bookingId);
        }
    }
}
