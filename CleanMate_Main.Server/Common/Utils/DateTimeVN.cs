namespace CleanMate_Main.Server.Common.Utils
{
    public static class DateTimeVN
    {
        public static DateTime GetNow()
        {
            string timeZoneId = OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh";
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);
        }
    }
}
