﻿namespace CleanMate_Main.Server.Models.ViewModels.Authen
{
    public class RegisterModel
    {
        public string FullName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
        public string? Identification { get; set; }
        public string? Bank { get; set; }
        public string? BankAccount { get; set; }


    }
}
