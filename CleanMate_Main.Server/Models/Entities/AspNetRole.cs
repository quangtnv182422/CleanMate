using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace CleanMate_Main.Server.Models.Entities;

public partial class AspNetRole : IdentityRole
{
    public virtual ICollection<AspNetUser> Users { get; set; } = new List<AspNetUser>();
}
