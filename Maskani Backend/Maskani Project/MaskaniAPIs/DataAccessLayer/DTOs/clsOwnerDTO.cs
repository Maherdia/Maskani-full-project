using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.DTOs
{
    public class clsOwnerDTO : clsPeopleDTO
    {
        public int OwnerID { set; get; }
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { set; get; }
        public clsOwnerDTO(int PersonID, string FirstName, string LastName, string Phone, string Email, int OwnerID, string Password)
            : base(PersonID, FirstName, LastName, Phone, Email, "Owner")
        {
            this.OwnerID = OwnerID;
            this.Password = Password;
        }
        public clsOwnerDTO() : base()
        {
            Role = "Owner";
            this.OwnerID = -1;
            this.Password = string.Empty;
        }
    }

    public class clsAddOwnerDTO : clsAddPeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { set; get; }
        public clsAddOwnerDTO(string FirstName, string LastName, string Phone, string Email, string Password)
            : base(FirstName, LastName, Phone, Email, "Owner")
        {
            this.Password = Password;
        }
        public clsAddOwnerDTO() : base()
        {
            Password = string.Empty;
            Role = "Owner";
        }
    }

    public class clsUpdateOwnerDTO : clsUpdatePeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        public int OwnerID { get; set; }

        public clsUpdateOwnerDTO(
            int personID,
            int OwnerID,
            string firstName,
            string lastName,
            string phone,
            string email,
            string password)
            : base(personID, firstName, lastName, phone, email, "Owner")
        {
            this.OwnerID = OwnerID;
            this.Password = password;
        }

        public clsUpdateOwnerDTO() : base()
        {
            OwnerID = -1;
            Password = string.Empty;
            Role = "Owner"; // still part of base class
        }
    }
}
