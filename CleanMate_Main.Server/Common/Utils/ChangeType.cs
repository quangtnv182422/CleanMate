namespace CleanMate_Main.Server.Common.Utils
{
    public class ChangeType
    {
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
