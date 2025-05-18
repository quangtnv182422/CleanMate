using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class AspNetUser : IdentityUser
{
    public bool Gender { get; set; }

    public DateTime Dob { get; set; }

    public DateTime CreatedDate { get; set; }

    public string? BankName { get; set; }

    public string? BankNo { get; set; }

    public string? ProfileImage { get; set; }

    public string? FullName { get; set; }


    public virtual ICollection<Booking> BookingCleaners { get; set; } = new List<Booking>();

    public virtual ICollection<Booking> BookingUsers { get; set; } = new List<Booking>();

    public virtual ICollection<CleanerProfile> CleanerProfiles { get; set; } = new List<CleanerProfile>();

    public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; } = new List<CustomerAddress>();

    public virtual ICollection<Feedback> FeedbackCleaners { get; set; } = new List<Feedback>();

    public virtual ICollection<Feedback> FeedbackUsers { get; set; } = new List<Feedback>();

    public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();

    public virtual ICollection<AspNetRole> Roles { get; set; } = new List<AspNetRole>();
}
