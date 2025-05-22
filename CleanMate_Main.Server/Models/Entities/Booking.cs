using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;
public partial class Booking
{
    public int BookingId { get; set; }

    public int ServicePriceId { get; set; }

    public string CleanerId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public int BookingStatusId { get; set; }

    public string? Note { get; set; }


    public int? AddressId { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public decimal? TotalPrice { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual BookingStatus BookingStatus { get; set; } = null!;

    public virtual AspNetUser Cleaner { get; set; } = null!;

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ServicePrice ServicePrice { get; set; } = null!;

    public virtual AspNetUser User { get; set; } = null!;

    public virtual CustomerAddress? Address { get; set; } = null!;
}

