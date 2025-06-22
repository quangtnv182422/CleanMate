namespace CleanMate_Main.Server.Models.DTO
{
    public class AssignVoucherDTO
    {
        public string UserId { get; set; }
        public int VoucherId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
