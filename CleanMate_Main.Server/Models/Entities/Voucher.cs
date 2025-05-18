using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class Voucher
{
    public int VoucherId { get; set; }

    public string? Description { get; set; }

    public decimal? DiscountPercentage { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateOnly? ExpireDate { get; set; }

    public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();
}
