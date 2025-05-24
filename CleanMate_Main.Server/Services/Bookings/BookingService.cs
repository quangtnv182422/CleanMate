using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.CleanService.AllService;
using Humanizer;
using Microsoft.EntityFrameworkCore;

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
    }
}
