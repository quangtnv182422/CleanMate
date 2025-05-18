using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class BookingStatus
{
    public int BookingStatusId { get; set; }

    public string Status { get; set; } = null!;

    public string? StatusDescription { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
