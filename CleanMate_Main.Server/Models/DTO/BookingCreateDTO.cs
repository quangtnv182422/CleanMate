﻿namespace CleanMate_Main.Server.Models.DTO
{
    public class BookingCreateDTO
    {
        public int ServicePriceId { get; set; }
        public string? CleanerId { get; set; } // ko cần trả bên client
        public string UserId { get; set; }
        public int? BookingStatusId { get; set; } // ko cần trả bên client
        public string? Note { get; set; }
        public int AddressId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public decimal? TotalPrice { get; set; }
    }
}
