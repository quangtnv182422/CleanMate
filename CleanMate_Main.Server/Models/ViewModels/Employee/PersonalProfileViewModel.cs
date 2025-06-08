namespace CleanMate_Main.Server.Models.ViewModels.Employee
{
    public class PersonalProfileViewModel
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AvatarUrl { get; set; } 
        public string IdCardNumber { get; set; } 
        public string BankName { get; set; }
        public string BankNo { get; set; }
        public bool Gender { get; set; }
        public DateTime Dob { get; set; }
        public string ActiveAreas { get; set; }
        public bool IsAvailable { get; set; }
        public int ExperienceYears { get; set; }
        public double AverageRating { get; set; }
    }
}
