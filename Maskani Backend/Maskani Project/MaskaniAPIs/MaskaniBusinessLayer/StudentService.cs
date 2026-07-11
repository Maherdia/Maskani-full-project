using DataAccessLayer;
using MaskaniBusinessLayer.Utility;
using MaskaniDataAccess.DataAccess;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class StudentService
    {
        private readonly IStudentRepository _studentRepository;
        public StudentService(IStudentRepository studentRepository) => _studentRepository = studentRepository;
        public async Task<int> AddStudentAsync(clsAddStudentDTO dto)
        {
            if (await clsEmailValidator.IsEmailRealAsync(dto.Email)) 
            return await _studentRepository.AddAsync(dto);
            else
                throw new ArgumentException("Invalid email address.");
        }
        public async Task<bool> UpdateStudentAsync(clsUpdateStudentDTO dto)
        {
            if (await clsEmailValidator.IsEmailRealAsync(dto.Email))
            return await _studentRepository.UpdateAsync(dto);
            else
                throw new ArgumentException("Invalid email address.");
        }
        public async Task<bool> DeleteStudentAsync(int studentId) => await _studentRepository.DeleteAsync(studentId);
        public async Task<IEnumerable<clsStudentDTO>> GetAllStudentsAsync() => await _studentRepository.GetAllAsync();
        public async Task<clsStudentDTO?> GetStudentByIdAsync(int studentId) => await _studentRepository.GetByIdAsync(studentId);
        public async Task<bool> ChangePasswordAsync(int studentId, string newPassword) => await _studentRepository.ChangePasswordAsync(studentId, newPassword);
        public async Task<clsStudentDTO?> LoginAsync(string email, string password) => await _studentRepository.LoginAsync(email, clsHashing.HashPassword(password));
        public async Task<bool> VerifyPasswordAsync(string email, string password)
        {
            var student = await _studentRepository.GetStudentByEmail(email);
            if (student == null)
                return false;
            string hasedPassword = clsHashing.HashPassword(password);
            return clsHashing.VerifyPassword(password, hasedPassword);
        }
        public async Task<clsStudentDTO?> GetStudentByPersonIDAsync(int PersonID) => await _studentRepository.GetStudentByPersonID(PersonID);
        public async Task<clsStudentDTO> GetStudentByEmailAsync(string email) => await _studentRepository.GetStudentByEmail(email);
        public async Task<clsStudentDTO>GetStudentByPersonID(int PersonID)=>await _studentRepository.GetStudentByPersonID(PersonID);
    }
}
