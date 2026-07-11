using System.ComponentModel.DataAnnotations;
namespace MaskaniDataAccessLayer.DTOs
{
    public class clsPeopleDTO
    {
        public int PersonID { set; get; }
        [Required(ErrorMessage = "First Name is required.")]
        public string FirstName { set; get; }
        [Required(ErrorMessage = "Last Name is required.")]

        public string LastName { set; get; }
        [Required(ErrorMessage = "Phone is required.")]

        public string Phone { set; get; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email format.")]
        public string Email { set; get; }
        public string Role { set; get; }
        public static string GenerateVerificationToken()
        {
            return Guid.NewGuid().ToString();
        }
        public clsPeopleDTO() { }
        public clsPeopleDTO(int personID, string firstName, string lastName, string phone, string email, string role)
        {
            PersonID = personID;
            FirstName = firstName;
            LastName = lastName;
            Phone = phone;
            Email = email;
            Role = role;
        }
    }

    public class clsAddPeopleDTO
    {
        [Required(ErrorMessage = "First Name is required.")]
        public string FirstName { set; get; }
        [Required(ErrorMessage = "Last Name is required.")]

        public string LastName { set; get; }
        [Required(ErrorMessage = "Phone is required.")]

        public string Phone { set; get; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email format.")]
        public string Email { set; get; }
        public string Role { set; get; }
        public static string GenerateVerificationToken()
        {
            return Guid.NewGuid().ToString();
        }
        public clsAddPeopleDTO() { }
        public clsAddPeopleDTO(string firstName, string lastName, string phone, string email, string role)
        {
            FirstName = firstName;
            LastName = lastName;
            Phone = phone;
            Email = email;
            Role = role;
        }
    }

    public class clsUpdatePeopleDTO
    {
        public int PersonID { set; get; }
        [Required(ErrorMessage = "First Name is required.")]
        public string FirstName { set; get; }
        [Required(ErrorMessage = "Last Name is required.")]

        public string LastName { set; get; }
        [Required(ErrorMessage = "Phone is required.")]

        public string Phone { set; get; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email format.")]
        public string Email { set; get; }
        public string Role { set; get; }

        public clsUpdatePeopleDTO() { }
        public clsUpdatePeopleDTO(int personID, string firstName, string lastName, string phone, string email, string role)
        {
            PersonID = personID;
            FirstName = firstName;
            LastName = lastName;
            Phone = phone;
            Email = email;
            Role = role;
        }
    }
}
