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

    public string? VoucherCode { get; set; } // Mã voucher ẩn

    public bool IsEventVoucher { get; set; } // Đánh dấu voucher sự kiện

    public string? CreatedBy { get; set; } // Admin tạo voucher

    public string? Status { get; set; } // Trạng thái voucher

    public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();
}
