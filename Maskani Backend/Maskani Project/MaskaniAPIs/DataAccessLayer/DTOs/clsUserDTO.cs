using System.ComponentModel.DataAnnotations;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.DTOs
{
    public class clsUserDTO : clsPeopleDTO
    {
        public int UserID { get; set; }

        public string? Password { get; set; }

        public clsUserDTO(
            int personID,
            string firstName,
            string lastName,
            string phone,
            string email,
            int userID,
            string password)
            : base(
                personID,
                firstName,
                lastName,
                phone,
                email,
                "User")
        {
            UserID = userID;
            Password = password;
        }

        public clsUserDTO() : base()
        {
            Role = "User";
            UserID = -1;
            Password = null;
        }
    }

    public class clsAddUserDTO : clsAddPeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(
            6,
            ErrorMessage =
                "Password must be at least 6 characters.")]
        public string Password { get; set; } =
            string.Empty;

        public clsAddUserDTO(
            string firstName,
            string lastName,
            string phone,
            string email,
            string password)
            : base(
                firstName,
                lastName,
                phone,
                email,
                "User")
        {
            Password = password;
        }

        public clsAddUserDTO() : base()
        {
            Role = "User";
        }
    }

    public class clsUpdateUserDTO :
        clsUpdatePeopleDTO
    {
        public int UserID { get; set; }

        public clsUpdateUserDTO(
            int personID,
            int userID,
            string firstName,
            string lastName,
            string phone,
            string email)
            : base(
                personID,
                firstName,
                lastName,
                phone,
                email,
                "User")
        {
            UserID = userID;
        }

        public clsUpdateUserDTO() : base()
        {
            UserID = -1;
            Role = "User";
        }
    }
}