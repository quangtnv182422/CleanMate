using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class CustomerAddress
{
    public int AddressId { get; set; }

    public string UserId { get; set; } = null!;

    public virtual AspNetUser User { get; set; } = null!;
}
