namespace CleanMate_Main.Server.Models.DTO
{
    public class AssignVoucherMultipleDTO
    {
        public List<string> UserIds { get; set; }
        public int VoucherId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
