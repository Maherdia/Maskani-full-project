using System.Collections.Generic;
using System.Threading.Tasks;
using DataAccessLayer;
using MaskaniBusinessLayer.Utility;
using MaskaniDataAccess.DataAccess;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository) => _userRepository = userRepository;
        public async Task<int> AddUserAsync(clsAddUserDTO dto)
        {
            if (await clsEmailValidator.IsEmailRealAsync(dto.Email))
            {
                return await _userRepository.AddAsync(dto);
            }
            else
            {
                throw new ArgumentException("Invalid email address.");
            }
        }
        public async Task<bool> UpdateUserAsync(clsUpdateUserDTO dto)
        {
            if (await clsEmailValidator.IsEmailRealAsync(dto.Email))
            {
                return await _userRepository.UpdateAsync(dto);
            }
            else
            {
                throw new ArgumentException("Invalid email address.");
            }
        }
        public async Task<bool> DeleteUserAsync(int userId) => await _userRepository.DeleteAsync(userId);
        public async Task<IEnumerable<clsUserDTO>> GetAllUsersAsync() => await _userRepository.GetAllAsync();
        public async Task<clsUserDTO?> GetUserByIdAsync(int userId) => await _userRepository.GetByIdAsync(userId);
        public async Task<bool> ChangePasswordAsync(int userId, string newPassword) => await _userRepository.ChangePasswordAsync(userId, newPassword);
        public async Task<clsUserDTO?> LoginAsync(string email, string password) => await _userRepository.LoginAsync(email, clsHashing.HashPassword(password));
        public async Task<bool> VerifyPasswordAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
                return false;
            string hashedPassword = clsHashing.HashPassword(password);
            return clsHashing.VerifyPassword(password, hashedPassword);
        }
        public async Task<clsUserDTO?> GetUserByPersonID(int PersonID) => await _userRepository.GetUserByPersonID(PersonID);
        public async Task<clsUserDTO?> GetUserByEmailAsync(string email) => await _userRepository.GetUserByEmailAsync(email);
    }
}
