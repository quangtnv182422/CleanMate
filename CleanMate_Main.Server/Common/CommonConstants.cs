namespace CleanMate_Main.Server.Common
{
    public class CommonConstants
    {
        public const int DefaultPageSize = 9;
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
                CommonConstants.BookingStatus.PENDING_DONE => "Chờ xác nhận",
                CommonConstants.BookingStatus.DONE => "Hoàn thành",
                _ => "Không xác định"
            };
        }

    }
}
