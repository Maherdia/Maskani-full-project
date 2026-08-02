using System.ComponentModel.DataAnnotations;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.DTOs
{
    public class clsOwnerDTO : clsPeopleDTO
    {
        public int OwnerID { get; set; }

        public string? Password { get; set; }

        public clsOwnerDTO(
            int personID,
            string firstName,
            string lastName,
            string phone,
            string email,
            int ownerID,
            string password)
            : base(
                personID,
                firstName,
                lastName,
                phone,
                email,
                "Owner")
        {
            OwnerID = ownerID;
            Password = password;
        }

        public clsOwnerDTO() : base()
        {
            Role = "Owner";
            OwnerID = -1;
            Password = null;
        }
    }

    public class clsAddOwnerDTO : clsAddPeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(
            6,
            ErrorMessage =
                "Password must be at least 6 characters.")]
        public string Password { get; set; } =
            string.Empty;

        public clsAddOwnerDTO(
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
                "Owner")
        {
            Password = password;
        }

        public clsAddOwnerDTO() : base()
        {
            Role = "Owner";
        }
    }

    public class clsUpdateOwnerDTO :
        clsUpdatePeopleDTO
    {
        public int OwnerID { get; set; }

        public clsUpdateOwnerDTO(
            int personID,
            int ownerID,
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
                "Owner")
        {
            OwnerID = ownerID;
        }

        public clsUpdateOwnerDTO() : base()
        {
            OwnerID = -1;
            Role = "Owner";
        }
    }
}