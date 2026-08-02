using DataAccessLayer;
using MaskaniBusinessLayer.Utility;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class StudentService
    {
        private readonly IStudentRepository
            _studentRepository;

        private readonly clsEmailValidator
            _emailValidator;

        public StudentService(
            IStudentRepository studentRepository,
            clsEmailValidator emailValidator)
        {
            _studentRepository = studentRepository;
            _emailValidator = emailValidator;
        }

        public async Task<int> AddStudentAsync(
            clsAddStudentDTO studentDTO)
        {
            if (string.IsNullOrWhiteSpace(
                    studentDTO.Email))
            {
                throw new ArgumentException(
                    "Email is required.",
                    nameof(studentDTO.Email));
            }

            bool emailIsValid =
                await _emailValidator.IsEmailRealAsync(
                    studentDTO.Email.Trim());

            if (!emailIsValid)
            {
                throw new ArgumentException(
                    "Invalid email address.",
                    nameof(studentDTO.Email));
            }

            if (string.IsNullOrWhiteSpace(
                    studentDTO.Password))
            {
                throw new ArgumentException(
                    "Password is required.",
                    nameof(studentDTO.Password));
            }

            var secureStudentDTO =
                new clsAddStudentDTO
                {
                    FirstName =
                        studentDTO.FirstName.Trim(),

                    LastName =
                        studentDTO.LastName.Trim(),

                    Phone =
                        studentDTO.Phone.Trim(),

                    Email =
                        studentDTO.Email.Trim(),

                    Password =
                        clsHashing.HashPassword(
                            studentDTO.Password)
                };

            return await _studentRepository.AddAsync(
                secureStudentDTO);
        }

        public async Task<bool> UpdateStudentAsync(
            clsUpdateStudentDTO updateDTO)
        {
            if (string.IsNullOrWhiteSpace(
                    updateDTO.Email))
            {
                throw new ArgumentException(
                    "Email is required.",
                    nameof(updateDTO.Email));
            }

            bool emailIsValid =
                await _emailValidator.IsEmailRealAsync(
                    updateDTO.Email.Trim());

            if (!emailIsValid)
            {
                throw new ArgumentException(
                    "Invalid email address.",
                    nameof(updateDTO.Email));
            }

            updateDTO.Email =
                updateDTO.Email.Trim();

            return await _studentRepository.UpdateAsync(
                updateDTO);
        }

        public async Task<bool> DeleteStudentAsync(
            int studentId)
        {
            return await _studentRepository.DeleteAsync(
                studentId);
        }

        public async Task<IEnumerable<clsStudentDTO>>
            GetAllStudentsAsync()
        {
            return await _studentRepository.GetAllAsync();
        }

        public async Task<clsStudentDTO?>
            GetStudentByIdAsync(int studentId)
        {
            return await _studentRepository.GetByIdAsync(
                studentId);
        }

        public async Task<clsStudentDTO?>
            GetStudentByPersonIDAsync(int personId)
        {
            return await _studentRepository
                .GetStudentByPersonID(personId);
        }

        public async Task<clsStudentDTO?>
            GetStudentByPersonID(int personId)
        {
            return await _studentRepository
                .GetStudentByPersonID(personId);
        }

        public async Task<clsStudentDTO?>
            GetStudentByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            return await _studentRepository
                .GetStudentByEmail(email.Trim());
        }

        public async Task<bool> ChangePasswordAsync(
            int studentId,
            string plainTextNewPassword)
        {
            if (string.IsNullOrWhiteSpace(
                    plainTextNewPassword))
            {
                throw new ArgumentException(
                    "New password is required.",
                    nameof(plainTextNewPassword));
            }

            string passwordHash =
                clsHashing.HashPassword(
                    plainTextNewPassword);

            return await _studentRepository
                .ChangePasswordAsync(
                    studentId,
                    passwordHash);
        }

        public async Task<clsStudentDTO?> LoginAsync(
            string email,
            string password)
        {
            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                return null;
            }

            var student =
                await _studentRepository
                    .GetStudentByEmail(email.Trim());

            if (student == null ||
                string.IsNullOrWhiteSpace(
                    student.Password))
            {
                return null;
            }

            if (!clsHashing.VerifyPassword(
                    password,
                    student.Password))
            {
                return null;
            }

            student.Password = null;

            return student;
        }

        public async Task<bool> VerifyPasswordAsync(
            string email,
            string password)
        {
            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                return false;
            }

            var student =
                await _studentRepository
                    .GetStudentByEmail(email.Trim());

            if (student == null ||
                string.IsNullOrWhiteSpace(
                    student.Password))
            {
                return false;
            }

            return clsHashing.VerifyPassword(
                password,
                student.Password);
        }
    }
}