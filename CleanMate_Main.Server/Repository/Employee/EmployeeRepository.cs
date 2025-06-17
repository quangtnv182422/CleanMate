using CleanMate_Main.Server.Common;
using CleanMate_Main.Server.Models;
using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.DTO;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Models.ViewModels.Customer;
using CleanMate_Main.Server.Models.ViewModels.Employee;
using CleanMate_Main.Server.Models.ViewModels.Wallet;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
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
                            Duration = duration.DurationTime,
                            Address = address.GG_DispalyName,
                            Note = booking.Note,
                            TotalPrice = booking.TotalPrice ?? 0m,
                            Status = Common.CommonConstants.GetStatusString(booking.BookingStatusId),
                            AddressNo = address.AddressNo,
                            CreatedAt = booking.CreatedAt,
                            UpdatedAt = booking.UpdatedAt
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
                            ServiceDescription = duration.SquareMeterSpecific + "m² làm trong " + duration.DurationTime + " giờ",
                            Duration = $"{duration.DurationTime} giờ",
                            Price = Common.CommonConstants.ChangeMoneyType(servicePrice.Price),
                            Commission = Common.CommonConstants.ChangeMoneyType(Math.Floor(servicePrice.Price * CommonConstants.COMMISSION_PERCENTAGE / 1000) * 1000),
                            Date = booking.Date.ToString("dd-MM-yyyy"),
                            StartTime = Common.CommonConstants.ChangeTimeType(booking.StartTime),
                            Address = address.GG_DispalyName,
                            AddressNo = address.AddressNo,
                            Note = booking.Note,
                            Status = CommonConstants.GetStatusString(booking.BookingStatusId),
                            StatusId = booking.BookingStatusId,
                            IsRead = false,
                            CustomerFullName = customer.FullName,
                            CustomerPhoneNumber = customer.PhoneNumber,
                            EmployeeId = booking.CleanerId,
                            PlaceID = address.GG_PlaceId,
                            Latitude = address.Latitude.ToString(),
                            Longitude = address.Longitude.ToString(),
                            decimalCommission = Math.Floor(servicePrice.Price * CommonConstants.COMMISSION_PERCENTAGE / 1000) * 1000,
                            decimalPrice = servicePrice.Price
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
                            Duration = duration.DurationTime,
                            Address = address.AddressNo + " " + address.GG_FormattedAddress,
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

        public async Task<bool> ChangeWorkAsync(int bookingId, int status, string? employeeId = null)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(bookingId);
                if (booking == null)
                {
                    return false; // Booking not found
                }

                booking.BookingStatusId = status;

                if (!string.IsNullOrEmpty(employeeId))
                {
                    booking.CleanerId = employeeId;
                }
                else
                {
                    booking.CleanerId = null;
                }
                    await _context.SaveChangesAsync();
                return true; // Successfully updated
            }
            catch
            {
                return false; // Something went wrong
            }
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
        public async Task<IEnumerable<object>> GetBookingStatusesAsync()
        {
            return await _context.BookingStatuses
                .Select(s => new { id = s.BookingStatusId, name = s.Status })
                .OrderBy(s => s.id)
                .ToListAsync();
        }
        public async Task<bool> CanCleanerAcceptWorkAsync(int bookingId, string employeeId)
        {
            // Step 1: Lấy thông tin công việc mới
            var newWork = await _context.Bookings
                .Join(_context.ServicePrices, b => b.ServicePriceId, sp => sp.PriceId, (b, sp) => new { b, sp })
                .Join(_context.Durations, bsp => bsp.sp.DurationId, d => d.DurationId, (bsp, d) => new
                {
                    BookingId = bsp.b.BookingId,
                    Date = bsp.b.Date,
                    StartTime = bsp.b.StartTime,
                    Duration = d.DurationTime,
                    CleanerId = bsp.b.CleanerId
                })
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (newWork == null)
                throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");

            if (newWork.CleanerId != null && newWork.CleanerId != employeeId)
                return false; // Công việc đã có người nhận

            if (newWork.Date == default || newWork.StartTime == default)
                return false; // Thiếu ngày hoặc giờ bắt đầu

            DateTime newWorkStart = newWork.Date.ToDateTime(newWork.StartTime);
            DateTime newWorkEnd = newWorkStart.AddHours(newWork.Duration);

            // Step 2: Lấy các công việc khác của cleaner
            var existingWorks = await _context.Bookings
                .Join(_context.ServicePrices, b => b.ServicePriceId, sp => sp.PriceId, (b, sp) => new { b, sp })
                .Join(_context.Durations, bsp => bsp.sp.DurationId, d => d.DurationId, (bsp, d) => new
                {
                    BookingId = bsp.b.BookingId,
                    Date = bsp.b.Date,
                    StartTime = bsp.b.StartTime,
                    Duration = d.DurationTime,
                    CleanerId = bsp.b.CleanerId,
                    StatusId = bsp.b.BookingStatusId
                })
                .Where(b => b.CleanerId == employeeId &&
                       (b.StatusId == CommonConstants.BookingStatus.NEW
                     || b.StatusId == CommonConstants.BookingStatus.ACCEPT
                     || b.StatusId == CommonConstants.BookingStatus.IN_PROGRESS
                     || b.StatusId == CommonConstants.BookingStatus.PENDING_DONE))
                .ToListAsync();

            // Step 3: Kiểm tra trùng giờ hoặc không đủ thời gian nghỉ
            foreach (var work in existingWorks)
            {
                if (work.Date == default || work.StartTime == default)
                    continue;

                DateTime existingStart = work.Date.ToDateTime(work.StartTime);
                DateTime existingEnd = existingStart.AddHours(work.Duration);

                // Trùng thời gian
                if (newWorkStart < existingEnd && newWorkEnd > existingStart)
                    return false;

                // Không đủ thời gian nghỉ
                TimeSpan gap = (newWorkStart > existingStart)
                    ? newWorkStart - existingEnd
                    : existingStart - newWorkEnd;

                if (gap < CommonConstants.TIME_INTERVAL)
                    return false;
            }

            return true; // Không trùng lịch, có thể nhận
        }
        public async Task CreateCleanerProfileAsync(string userId)
        {
            if (await _context.CleanerProfiles.AnyAsync(p => p.UserId == userId))
            {
                return;
            }
            var cleanerProfile = new CleanerProfile
            {
                UserId = userId,
                Rating = 0,
                ExperienceYear = 0,
                Available = true,
                Area = "Hòa Lạc"
            };

            _context.CleanerProfiles.Add(cleanerProfile);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<WorkHistoryViewModel>> GetWorkHistoryAsync(string employeeId)
        {
            var query = from booking in _context.Bookings
                        join servicePrice in _context.ServicePrices on booking.ServicePriceId equals servicePrice.PriceId
                        join service in _context.Services on servicePrice.ServiceId equals service.ServiceId
                        join duration in _context.Durations on servicePrice.DurationId equals duration.DurationId
                        join customer in _context.Users on booking.UserId equals customer.Id
                        join address in _context.CustomerAddresses on booking.AddressId equals address.AddressId
                        join feedback in _context.Feedbacks on booking.BookingId equals feedback.BookingId into feedbacks
                        from feedback in feedbacks.DefaultIfEmpty()
                        where booking.CleanerId == employeeId
                           && (booking.BookingStatusId == CommonConstants.BookingStatus.DONE
                               || booking.BookingStatusId == CommonConstants.BookingStatus.CANCEL)
                        select new WorkHistoryViewModel
                        {
                            BookingId = booking.BookingId,
                            ServiceName = service.Name,
                            CustomerFullName = customer.FullName,
                            Date = booking.Date,
                            StartTime = booking.StartTime,
                            Duration = duration.DurationTime,
                            Address = address.AddressNo + " " + address.GG_FormattedAddress,
                            Note = booking.Note,
                            Earnings = booking.TotalPrice.HasValue
                                ? Math.Floor(booking.TotalPrice.Value * (1 - CommonConstants.COMMISSION_PERCENTAGE / 100) / 1000) * 1000
                                : 0m,
                            Rating = feedback != null ? feedback.Rating : null,
                            Comment = feedback != null ? feedback.Content : null,
                            Status = CommonConstants.GetStatusString(booking.BookingStatusId)
                        };

            return await query.ToListAsync();
        }

        public async Task<EarningsSummaryViewModel> GetEarningsSummaryAsync(string employeeId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.CleanerId == employeeId && b.BookingStatusId == CommonConstants.BookingStatus.DONE)
                .ToListAsync();

            var totalEarnings = bookings
                .Sum(b => b.TotalPrice.HasValue
                    ? Math.Floor(b.TotalPrice.Value * (1 - CommonConstants.COMMISSION_PERCENTAGE / 100) / 1000) * 1000
                    : 0m);

            var wallet = await _context.UserWallets
                .FirstOrDefaultAsync(w => w.UserId == employeeId);

            var transactions = await _context.WalletTransactions
                .Where(t => t.Wallet.UserId == employeeId)
                .Select(t => new TransactionViewModel
                {
                    TransactionId = t.TransactionId,
                    BookingId = t.RelatedBookingId,
                    Amount = t.Amount,
                    TransactionDate = t.CreatedAt,
                    TransactionType = t.TransactionType.ToString(),
                    Description = t.Description ?? ""
                })
                .ToListAsync();

            var withdrawalRequests = await _context.WithdrawRequests
                .Where(w => w.UserId == employeeId)
                .Select(w => new WithdrawRequestViewModel
                {
                    WithdrawalId = w.RequestId,
                    Amount = w.Amount,
                    RequestDate = w.RequestedAt,
                    Status = w.Status.ToString()
                })
                .ToListAsync();

            return new EarningsSummaryViewModel
            {
                TotalEarnings = totalEarnings,
                AvailableBalance = wallet?.Balance ?? 0m,
                Transactions = transactions,
                WithdrawalRequests = withdrawalRequests
            };
        }



        public async Task<PersonalProfileViewModel> GetPersonalProfileAsync(string employeeId)
        {
            var query = from user in _context.Users
                        join profile in _context.CleanerProfiles on user.Id equals profile.UserId
                        join wallet in _context.UserWallets on user.Id equals wallet.UserId
                        where user.Id == employeeId
                        select new PersonalProfileViewModel
                        {
                            UserId = user.Id,
                            FullName = user.FullName ?? "",
                            Email = user.Email ?? "",
                            PhoneNumber = user.PhoneNumber ?? "",
                            AvatarUrl = user.ProfileImage ?? "",
                            IdCardNumber = user.CCCD ?? "",
                            BankName = user.BankName ?? "",
                            BankNo = user.BankNo ?? "",
                            Gender = user.Gender,
                            Dob = user.Dob,
                            ActiveAreas = profile.Area ?? "",
                            IsAvailable = profile.Available ?? false,
                            ExperienceYears = profile.ExperienceYear ?? 0,
                            AverageRating = profile.Rating ?? 0,
                            Balance = wallet.Balance
                        };

            return await query.FirstOrDefaultAsync() ?? throw new KeyNotFoundException($"Profile for employee ID {employeeId} not found.");
        }

        public async Task<bool> UpdatePersonalProfileAsync(PersonalProfileViewModel profile)
        {
            var user = await _context.Users.FindAsync(profile.UserId);
            var cleanerProfile = await _context.CleanerProfiles
                .FirstOrDefaultAsync(p => p.UserId == profile.UserId);

            if (user == null || cleanerProfile == null)
            {
                return false;
            }

            user.FullName = profile.FullName;
            user.Email = profile.Email;
            user.PhoneNumber = profile.PhoneNumber;
            user.ProfileImage = profile.AvatarUrl;
            user.CCCD = profile.IdCardNumber;
            user.BankName = profile.BankName;
            user.BankNo = profile.BankNo;
            user.Gender = profile.Gender;
            user.Dob = profile.Dob;

            cleanerProfile.Area = profile.ActiveAreas;
            cleanerProfile.Available = profile.IsAvailable;
            cleanerProfile.ExperienceYear = profile.ExperienceYears;
            cleanerProfile.Rating = profile.AverageRating;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CustomerReviewSummaryViewModel> GetCustomerReviewsAsync(string employeeId)
        {
            var reviews = await _context.Feedbacks
                .Join(_context.Bookings, f => f.BookingId, b => b.BookingId, (f, b) => new { f, b })
                .Join(_context.Users, fb => fb.b.UserId, u => u.Id, (fb, u) => new
                {
                    Feedback = fb.f,
                    CustomerFullName = u.FullName,
                    Booking = fb.b
                })
                .Where(fb => fb.Booking.CleanerId == employeeId)
                .Select(fb => new CustomerReviewViewModel
                {
                    BookingId = fb.Feedback.BookingId,
                    CustomerFullName = fb.CustomerFullName ?? "",
                    Rating = fb.Feedback.Rating ?? 0,
                    Comment = fb.Feedback.Content ?? "",
                    ReviewDate = fb.Feedback.CreatedAt ?? CommonConstants.GetCurrentTime()
                })
                .ToListAsync();

            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
            var totalReviews = reviews.Count;

            return new CustomerReviewSummaryViewModel
            {
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                Reviews = reviews
            };
        }
        public async Task<decimal> GetMonthlyEarningsAsync(string employeeId)
        {
            var currentMonth = CommonConstants.GetCurrentTime();
            var startOfMonth = new DateOnly(currentMonth.Year, currentMonth.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            var bookings = await _context.Bookings
                .Where(b => b.CleanerId == employeeId
                    && b.BookingStatusId == CommonConstants.BookingStatus.DONE
                    && b.Date >= startOfMonth
                    && b.Date <= endOfMonth)
                .ToListAsync();

            return bookings
                .Sum(b => b.TotalPrice.HasValue
                    ? Math.Floor(b.TotalPrice.Value * (1 - CommonConstants.COMMISSION_PERCENTAGE / 100) / 1000) * 1000
                    : 0m);
        }
        public async Task<IEnumerable<MonthlyEarningViewModel>> GetEarningsByMonthAsync(string employeeId)
        {
            var currentDate = CommonConstants.GetCurrentTime();
            var currentYear = currentDate.Year;
            var currentMonth = currentDate.Month;

            var monthlyEarnings = new List<MonthlyEarningViewModel>();

            for (int month = 1; month <= currentMonth; month++)
            {
                var startOfMonth = new DateOnly(currentYear, month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

                var bookings = await _context.Bookings
                    .Where(b => b.CleanerId == employeeId
                        && b.BookingStatusId == CommonConstants.BookingStatus.DONE
                        && b.Date >= startOfMonth
                        && b.Date <= endOfMonth)
                    .ToListAsync();

                var earnings = bookings
                    .Sum(b => b.TotalPrice.HasValue
                        ? Math.Floor(b.TotalPrice.Value * CommonConstants.COMMISSION_PERCENTAGE) :0m);

                var monthName = new CultureInfo("vi-VN").DateTimeFormat.GetMonthName(month);
                monthlyEarnings.Add(new MonthlyEarningViewModel
                {
                    Month = monthName,
                    Earnings = earnings
                });
            }

            return monthlyEarnings;
        }

        public async Task<List<CleanerDTO>> GetAvailableCleanersAsync()
        {
            return await _context.CleanerProfiles
                .Include(c => c.User)
                .Where(c => c.Available == true) //đoạn này làm để sau làm logic chọn lúc rảnh
                .Select(c => new CleanerDTO
                {
                    CleanerId = c.UserId,
                    Name = c.User.FullName
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<FeedbackHistoryViewModel>> GetFeedbackHistoryAsync(string employeeId)
        {
            var query = from booking in _context.Bookings
                        join feedback in _context.Feedbacks on booking.BookingId equals feedback.BookingId
                        join customer in _context.Users on booking.UserId equals customer.Id
                        where booking.CleanerId == employeeId
                            && booking.BookingStatusId == CommonConstants.BookingStatus.DONE
                            && feedback.Rating > 0
                        select new FeedbackHistoryViewModel
                        {
                            BookingId = booking.BookingId,
                            Date = booking.Date.ToDateTime(TimeOnly.MinValue), // Use a default TimeOnly if needed, or adjust
                            StartTime = booking.StartTime,
                            Rating = feedback.Rating,
                            Content = feedback.Content,
                            CustomerFullName = customer.FullName
                        };

            return await query.ToListAsync();
        }

        public async Task<int> CountFeedbackDone(string employeeId)
        {
            var existingRatingsCount = await _context.Feedbacks
                .Join(_context.Bookings, f => f.BookingId, b => b.BookingId, (f, b) => new { f, b })
                .Where(fb => fb.b.CleanerId == employeeId && fb.b.BookingStatusId == CommonConstants.BookingStatus.DONE && fb.f.Rating > 0)
                .CountAsync();
            return existingRatingsCount;
        }

    }
}