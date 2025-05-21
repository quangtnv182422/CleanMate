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
                CommonConstants.BookingStatus.NEW => "New",
                CommonConstants.BookingStatus.CANCEL => "Canceled",
                CommonConstants.BookingStatus.ACCEPT => "Accepted",
                CommonConstants.BookingStatus.IN_PROGRESS => "In Progress",
                CommonConstants.BookingStatus.PENDING_DONE => "Pending Done",
                CommonConstants.BookingStatus.DONE => "Done",
                _ => "Unknown"
            };
        }

    }
}
