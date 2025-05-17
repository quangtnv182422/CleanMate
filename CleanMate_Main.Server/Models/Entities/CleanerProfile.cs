using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class CleanerProfile
{
    public int CleanerId { get; set; }

    public string UserId { get; set; } = null!;

    public double? Rating { get; set; }

    public int? ExperienceYear { get; set; }

    public bool? Available { get; set; }

    public string? Area { get; set; }

    public virtual AspNetUser User { get; set; } = null!;
}
