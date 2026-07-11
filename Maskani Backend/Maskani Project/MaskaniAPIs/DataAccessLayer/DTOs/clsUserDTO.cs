using System.ComponentModel.DataAnnotations;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.DTOs
{
    public class clsUserDTO:clsPeopleDTO
    {
        public int UserID { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        public clsUserDTO(int personID, string firstName, string lastName, string phone, string email, int userID, string password)
            : base(personID, firstName, lastName, phone, email, "User")
        {
            UserID = userID;
            Password = password;
        }

        public clsUserDTO() : base()
        {
            Role = "User";
            UserID = -1;
            Password = string.Empty;
        }
    }

    public class clsAddUserDTO : clsAddPeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        public clsAddUserDTO(string firstName, string lastName, string phone, string email, string password)
            : base(firstName, lastName, phone, email, "User")
        {
            Password = password;
        }

        public clsAddUserDTO() : base()
        {
            Role = "User";
            Password = string.Empty;
        }
    }

    public class clsUpdateUserDTO : clsUpdatePeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        public int UserID { get; set; }

        public clsUpdateUserDTO(int personID,int UserID,string firstName,string lastName,string phone,string email,string password)
            : base(personID, firstName, lastName, phone, email, "User")
        {
            this.UserID = UserID;
            this.Password = password;
        }

        public clsUpdateUserDTO() : base()
        {
            UserID = -1;
            Password = string.Empty;
            Role = "Student"; // still part of base class
        }
    }
}
