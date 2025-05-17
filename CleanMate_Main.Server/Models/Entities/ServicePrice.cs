using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class ServicePrice
{
    public int PriceId { get; set; }

    public int DurationId { get; set; }

    public int ServiceId { get; set; }

    public decimal Price { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Duration Duration { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
