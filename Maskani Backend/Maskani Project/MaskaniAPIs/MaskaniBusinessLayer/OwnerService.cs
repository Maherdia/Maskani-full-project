using DataAccessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class OwnerService
    {
        private readonly IOwnerRepository _ownerRepository;

        public OwnerService(IOwnerRepository ownerRepository)
        {
            _ownerRepository = ownerRepository;
        }

        public async Task<int> AddOwnerAsync(
            clsAddOwnerDTO ownerDTO)
        {
            var secureOwnerDTO = new clsAddOwnerDTO
            {
                FirstName = ownerDTO.FirstName,
                LastName = ownerDTO.LastName,
                Phone = ownerDTO.Phone,
                Email = ownerDTO.Email,
                Password = clsHashing.HashPassword(
                    ownerDTO.Password)
            };

            return await _ownerRepository.AddAsync(
                secureOwnerDTO);
        }

        public async Task<bool> UpdateOwnerAsync(
            clsUpdateOwnerDTO updateDTO)
        {
            return await _ownerRepository.UpdateAsync(
                updateDTO);
        }

        public async Task<bool> DeleteOwnerAsync(int ownerId)
        {
            return await _ownerRepository.DeleteAsync(
                ownerId);
        }

        public async Task<List<clsOwnerDTO>> GetAllOwnersAsync()
        {
            return await _ownerRepository.GetAllAsync();
        }

        public async Task<clsOwnerDTO?> GetOwnerByIdAsync(
            int ownerId)
        {
            return await _ownerRepository.GetByIdAsync(
                ownerId);
        }

        public async Task<clsOwnerDTO?> GetOwnerByPersonID(
            int personId)
        {
            return await _ownerRepository.GetOwnerByPersonID(
                personId);
        }

        public async Task<clsOwnerDTO?> GetByEmailAsync(
            string email)
        {
            return await _ownerRepository.GetByEmailAsync(
                email.Trim());
        }

        public async Task<bool> ChangePasswordAsync(
            int ownerId,
            string plainTextNewPassword)
        {
            if (string.IsNullOrWhiteSpace(plainTextNewPassword))
            {
                throw new ArgumentException(
                    "New password is required.",
                    nameof(plainTextNewPassword));
            }

            string passwordHash =
                clsHashing.HashPassword(
                    plainTextNewPassword);

            return await _ownerRepository.ChangePasswordAsync(
                ownerId,
                passwordHash);
        }

        public async Task<clsOwnerDTO?> LoginAsync(
            string email,
            string password)
        {
            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                return null;
            }

            var owner =
                await _ownerRepository.GetByEmailAsync(
                    email.Trim());

            if (owner == null ||
                string.IsNullOrWhiteSpace(owner.Password))
            {
                return null;
            }

            if (!clsHashing.VerifyPassword(
                    password,
                    owner.Password))
            {
                return null;
            }

            owner.Password = null;

            return owner;
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

            var owner =
                await _ownerRepository.GetByEmailAsync(
                    email.Trim());

            if (owner == null ||
                string.IsNullOrWhiteSpace(owner.Password))
            {
                return false;
            }

            return clsHashing.VerifyPassword(
                password,
                owner.Password);
        }
    }
}