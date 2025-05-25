namespace CleanMate_Main.Server.Models.DTO
{
    public class CustomerAddressDTO
    {
        public int AddressId { get; set; }
        public string UserId { get; set; } = null!;
        public string GG_FormattedAddress { get; set; } = null!;
        public string GG_DispalyName { get; set; } = null!;
        public string GG_PlaceId { get; set; } = null!;
        public string AddressNo { get; set; } = null!;
        public bool IsInUse { get; set; }
        public bool IsDefault { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
