using DataAccessLayer;
using MaskaniBusinessLayer.Utility;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class UserService
    {
        private readonly IUserRepository
            _userRepository;

        private readonly clsEmailValidator
            _emailValidator;

        public UserService(
            IUserRepository userRepository,
            clsEmailValidator emailValidator)
        {
            _userRepository = userRepository;
            _emailValidator = emailValidator;
        }

        public async Task<int> AddUserAsync(
            clsAddUserDTO userDTO)
        {
            if (string.IsNullOrWhiteSpace(
                    userDTO.Email))
            {
                throw new ArgumentException(
                    "Email is required.",
                    nameof(userDTO.Email));
            }

            bool emailIsValid =
                await _emailValidator.IsEmailRealAsync(
                    userDTO.Email.Trim());

            if (!emailIsValid)
            {
                throw new ArgumentException(
                    "Invalid email address.",
                    nameof(userDTO.Email));
            }

            if (string.IsNullOrWhiteSpace(
                    userDTO.Password))
            {
                throw new ArgumentException(
                    "Password is required.",
                    nameof(userDTO.Password));
            }

            var secureUserDTO =
                new clsAddUserDTO
                {
                    FirstName =
                        userDTO.FirstName.Trim(),

                    LastName =
                        userDTO.LastName.Trim(),

                    Phone =
                        userDTO.Phone.Trim(),

                    Email =
                        userDTO.Email.Trim(),

                    Password =
                        clsHashing.HashPassword(
                            userDTO.Password)
                };

            return await _userRepository.AddAsync(
                secureUserDTO);
        }

        public async Task<bool> UpdateUserAsync(
            clsUpdateUserDTO updateDTO)
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

            return await _userRepository.UpdateAsync(
                updateDTO);
        }

        public async Task<bool> DeleteUserAsync(
            int userId)
        {
            return await _userRepository.DeleteAsync(userId);
        }

        public async Task<IEnumerable<clsUserDTO>>
            GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<clsUserDTO?> GetUserByIdAsync(
            int userId)
        {
            return await _userRepository.GetByIdAsync(
                userId);
        }

        public async Task<clsUserDTO?> GetUserByPersonID(
            int personId)
        {
            return await _userRepository.GetUserByPersonID(
                personId);
        }

        public async Task<clsUserDTO?> GetUserByEmailAsync(
            string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            return await _userRepository
                .GetUserByEmailAsync(email.Trim());
        }

        public async Task<bool> ChangePasswordAsync(
            int userId,
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

            return await _userRepository
                .ChangePasswordAsync(
                    userId,
                    passwordHash);
        }

        public async Task<clsUserDTO?> LoginAsync(
            string email,
            string password)
        {
            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                return null;
            }

            var user =
                await _userRepository
                    .GetUserByEmailAsync(email.Trim());

            if (user == null ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                return null;
            }

            if (!clsHashing.VerifyPassword(
                    password,
                    user.Password))
            {
                return null;
            }

            user.Password = null;

            return user;
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

            var user =
                await _userRepository
                    .GetUserByEmailAsync(email.Trim());

            if (user == null ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                return false;
            }

            return clsHashing.VerifyPassword(
                password,
                user.Password);
        }
    }
}