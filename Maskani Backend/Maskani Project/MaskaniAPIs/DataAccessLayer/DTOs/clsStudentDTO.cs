using System.ComponentModel.DataAnnotations;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.DTOs
{
    public class clsStudentDTO : clsPeopleDTO
    {
        public int StudentID { get; set; }

        public string? Password { get; set; }

        public clsStudentDTO(
            int personID,
            string firstName,
            string lastName,
            string phone,
            string email,
            int studentID,
            string password)
            : base(
                personID,
                firstName,
                lastName,
                phone,
                email,
                "Student")
        {
            StudentID = studentID;
            Password = password;
        }

        public clsStudentDTO() : base()
        {
            Role = "Student";
            StudentID = -1;
            Password = null;
        }
    }

    public class clsAddStudentDTO : clsAddPeopleDTO
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(
            6,
            ErrorMessage =
                "Password must be at least 6 characters.")]
        public string Password { get; set; } =
            string.Empty;

        public clsAddStudentDTO(
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
                "Student")
        {
            Password = password;
        }

        public clsAddStudentDTO() : base()
        {
            Role = "Student";
        }
    }

    public class clsUpdateStudentDTO :
        clsUpdatePeopleDTO
    {
        public int StudentID { get; set; }

        public clsUpdateStudentDTO(
            int personID,
            int studentID,
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
                "Student")
        {
            StudentID = studentID;
        }

        public clsUpdateStudentDTO() : base()
        {
            StudentID = -1;
            Role = "Student";
        }
    }
}