using CleanMate_Main.Server.Models.Enum;
using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public decimal Amount { get; set; }

    public PaymentType PaymentMethod { get; set; } 

    public string PaymentStatus { get; set; } = null!;

    public string? TransactionId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
