using CleanMate_Main.Server.Models.Entities;

namespace CleanMate_Main.Server.Common
{
    public class CommonConstants
    {
        public const int DefaultPageSize = 9;
        public static readonly TimeSpan TIME_INTERVAL = TimeSpan.FromMinutes(20);
        // time interval between each work shift calculated in minutes
        public static readonly decimal COMMISSION_PERCENTAGE = 0.80m;
        //Commission percentage 
        public static readonly decimal MINIMUM_DEBIT_AMOUNT = 200000m; //toi thieu can 200k coin
        public static readonly decimal MINIMUM_DEPOSIT_AMOUNT = 200000m; //nap toi thieu 200k coin
        public static readonly decimal MINIMUM_COINS_TO_ACCEPT_WORK = 200000m; //toi thieu 200k coin de nhan viec
        public static readonly string DEFAULT_ADMIN = "";
        public static readonly string DEFAULT_CUSTOMER = "";
        public static readonly string DEFAULT_CLEANER = "";

        public static class BookingStatus
        {
            public const int NEW = 1;
            public const int CANCEL = 2;
            public const int ACCEPT = 3;
            public const int IN_PROGRESS = 4;
            public const int PENDING_DONE = 5;
            public const int DONE = 6;
        }
        public static string GetStatusString(int statusId)
        {
            return statusId switch
            {
                CommonConstants.BookingStatus.NEW => "Việc mới",
                CommonConstants.BookingStatus.CANCEL => "Đã huỷ",
                CommonConstants.BookingStatus.ACCEPT => "Đã nhận",
                CommonConstants.BookingStatus.IN_PROGRESS => "Đang thực hiện",
                CommonConstants.BookingStatus.PENDING_DONE => "Chờ khách hàng xác nhận",
                CommonConstants.BookingStatus.DONE => "Hoàn thành",
                _ => "Không xác định"
            };
        }
        public static string ChangeMoneyType(decimal amount)
        {
            string result = amount.ToString("N0", new System.Globalization.CultureInfo("vi-VN")) + " VND";
            return result;
        }
        public static string ChangeTimeType(TimeOnly time)
        {
            string result = time.Minute == 0 ? $"{time.Hour} giờ" : $"{time.Hour} giờ {time.Minute} phút";
            return result;
        }
    }
}
