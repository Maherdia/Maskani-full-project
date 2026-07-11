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
    public class clsStudentDTO :clsPeopleDTO
    {
        public int StudentID { set; get; }
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { set; get; }
        public clsStudentDTO(int PersonID, string FirstName, string LastName, string Phone, string Email, int StudentID, string Password)
            : base(PersonID, FirstName, LastName, Phone, Email, "Student")
        {
            this.StudentID = StudentID;
            this.Password = Password;
        }
        public clsStudentDTO() : base()
        {
            Role = "Student";
            this.StudentID = -1;
            this.Password = string.Empty;
        }
    }

    public class clsAddStudentDTO : clsAddPeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { set; get; }
        public clsAddStudentDTO(string FirstName, string LastName, string Phone, string Email, string Password)
            : base(FirstName, LastName, Phone, Email, "Student")
        {
            this.Password = Password;
        }
        public clsAddStudentDTO() : base()
        {
            Password = string.Empty;
            Role = "Student";
        }
    }

    public class clsUpdateStudentDTO : clsUpdatePeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        public int StudentID { get; set; }

        public clsUpdateStudentDTO(
            int personID,
            int studentID,
            string firstName,
            string lastName,
            string phone,
            string email,
            string password)
            : base(personID, firstName, lastName, phone, email, "Student")
        {
            this.StudentID = studentID;
            this.Password = password;
        }

        public clsUpdateStudentDTO() : base()
        {
            StudentID = -1;
            Password = string.Empty;
            Role = "Student"; // still part of base class
        }
    }

}
