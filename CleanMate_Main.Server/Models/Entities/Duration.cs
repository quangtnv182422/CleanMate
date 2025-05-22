using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class Duration
{
    public int DurationId { get; set; }

    public int DurationTime { get; set; }

    public string? SquareMeterSpecific { get; set; }

    public virtual ICollection<ServicePrice> ServicePrices { get; set; } = new List<ServicePrice>();
}
