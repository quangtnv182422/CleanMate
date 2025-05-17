using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int BookingId { get; set; }

    public string? UserId { get; set; }

    public string? CleanerId { get; set; }

    public double? Rating { get; set; }

    public string? Content { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual AspNetUser? Cleaner { get; set; }

    public virtual AspNetUser? User { get; set; }
}
