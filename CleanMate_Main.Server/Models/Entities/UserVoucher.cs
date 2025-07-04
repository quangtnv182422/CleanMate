﻿using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class UserVoucher
{
    public int UserVoucherId { get; set; }

    public string UserId { get; set; } = null!;

    public int VoucherId { get; set; }

    public int Quantity { get; set; }
    public bool IsUsed { get; set; } // Đánh dấu đã sử dụng

    public DateTime? UsedAt { get; set; } // Thời điểm sử dụng
    public virtual AspNetUser User { get; set; } = null!;

    public virtual Voucher Voucher { get; set; } = null!;
}
